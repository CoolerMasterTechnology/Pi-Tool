use serde_derive::{Serialize, Deserialize};
use crossbeam::crossbeam_channel::Receiver;
use std::collections::HashMap;
use crate::metrics::{Measurement, MetricIdentifier, Collector};
use crate::mapping::ButtonListener;
use crate::overclock::{OverclockParameters, overclock};
use crate::actions::reboot;
use crate::util::MappingRepr;

/// Defines commands that can be sent to the daemon
#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "command")]
pub enum Command {
    Overclock { params: OverclockParameters },
    Reboot,
    SubscribeMetric { metric: MetricIdentifier },
    UnsubscribeMetric { metric: MetricIdentifier },
    SyncMappings { mappings: HashMap<String, MappingRepr> },
}


/// Defines all events that can be emitted by the daemon
#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "event")]
pub enum Event {
    Measurement { measurement: Measurement },
    ButtonAction { id: String },
}

/// Starts the command handler
pub fn start_handler(peer_map: crate::PeerMap, ws_rx: Receiver<Command>) {
    std::thread::spawn(move || {
	// Starts metric collector
        let mut collector = Collector::new();
        collector.start(peer_map.clone());

        // Starts button press listener
	let mut btn_listener = ButtonListener::new();
	btn_listener.start(peer_map.clone());

        for cmd in ws_rx {
            match cmd {
                Command::Overclock { params: p } => {
		    overclock(p)
		},
                Command::Reboot => {
                    reboot().unwrap()
                },
                Command::SubscribeMetric { metric: m } => {
                    collector.subscribe(m);
                },
                Command::UnsubscribeMetric { metric: m } => {
                    collector.unsubscribe(m);
                },
                Command::SyncMappings { mappings: m_repr } => {
		    let mappings = m_repr.iter().map(|(id, m)| m.to_mapping(id)).collect();
		    btn_listener.sync(mappings);
                }
            }
        }
    });
}

/// Brodcasts `Event` to all clients
pub fn broadcast(peer_map: &crate::PeerMap, event: Event) {
    let event_json = serde_json::to_string(&event).unwrap();
    let mut peers = peer_map.lock().unwrap();

    for peer_tx in peers.values_mut() {
	let event_json_c= event_json.clone();
	peer_tx.unbounded_send(tungstenite::Message::Text(event_json_c)).unwrap();
    }
}
