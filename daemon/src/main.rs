// mod mapping;
mod metrics;
mod actions;
mod overclock;
mod mapping;
mod command_handler;
mod util;
use crate::command_handler::*;

use std::{
    collections::HashMap,
    io::Error as IoError,
    net::SocketAddr,
    sync::{Arc, Mutex},
};

use futures_util::{
    future, pin_mut,
    stream::TryStreamExt,
    StreamExt,
};
use futures::channel::mpsc::{unbounded, UnboundedSender};
use crossbeam::crossbeam_channel;

use tokio::net::{TcpListener, TcpStream};
use tungstenite::protocol::Message;
use log::*;
use simplelog::*;

// Declares types
type Tx = UnboundedSender<Message>;
type PeerMap = Arc<Mutex<HashMap<SocketAddr, Tx>>>;

async fn handle_connection(peer_map: PeerMap, raw_stream: TcpStream,
			   addr: SocketAddr, ws_in_tx: crossbeam_channel::Sender<Command>) {
    println!("Incoming TCP connection from: {}", addr);

    let ws_stream = tokio_tungstenite::accept_async(raw_stream)
        .await
        .expect("Error during the websocket handshake occurred");
    println!("WebSocket connection established: {}", addr);

    // Insert the write part of this peer to the peer map.
    let (tx, rx) = unbounded();
    peer_map.lock().unwrap().insert(addr, tx);

    let (outgoing, incoming) = ws_stream.split();

    let broadcast_incoming = incoming.try_for_each(|msg| {
	if msg.is_text() {
	    // Parses command 
	    let msg_str = msg.to_text().unwrap();
	    let cmd: Command = serde_json::from_str(msg_str).unwrap();

	    // Sends command to handler
	    if let Err(_e) = ws_in_tx.send(cmd) {
	    	warn!("Failed to send command to handler");
	    }
	}

        future::ok(())
    });

    let receive_from_others = rx.map(Ok).forward(outgoing);

    pin_mut!(broadcast_incoming, receive_from_others);
    future::select(broadcast_incoming, receive_from_others).await;

    debug!("{} disconnected", &addr);
    peer_map.lock().unwrap().remove(&addr);
}

#[tokio::main]
async fn main() -> Result<(), IoError> {
    CombinedLogger::init(
	vec![
	    SimpleLogger::new(LevelFilter::Debug, Config::default())
	]
    ).unwrap();

    info!("Starting Cooler Master Pi Tool Daemon...");

    // Sets up state and inbound channel
    let state = PeerMap::new(Mutex::new(HashMap::new()));
    let (ws_in_tx, ws_in_rx) = crossbeam_channel::unbounded();

    // Starts handler
    start_handler(state.clone(), ws_in_rx);

    // Creates event loop and TCP listener
    let addr = "127.0.0.1:9002";
    let try_socket = TcpListener::bind(&addr).await;
    let mut listener = try_socket.expect("Failed to start daemon!");

    debug!("Listening on: {}", addr);

    // Spawns handler for each connection
    while let Ok((stream, addr)) = listener.accept().await {
        tokio::spawn(handle_connection(state.clone(), stream, addr, ws_in_tx.clone()));
    }

    Ok(())
}

