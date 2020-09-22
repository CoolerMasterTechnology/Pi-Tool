import React, { Component, createContext } from "react";

const GridContext = createContext<{ items: number[] }>({ items: [] });

export const GridProvider: React.FC = (props) => {
    const [items, setItems] = React.useState({items: []});

    return (
    <GridContext.Provider value={items}>
    { props.children }
    </GridContext.Provider>
      );
}

// export class GridProvider extends Component {
//   constructor(props) {
//     super(props);
// 
//     this.state = {
//       items: [],
//       moveItem: this.moveItem,
//       setItems: this.setItems
//     };
//   }
// 
//   render() {
//     return (
//       <GridContext.Provider value={this.state}>
//         {this.props.children}
//       </GridContext.Provider>
//     );
//   }
// 
//   setItems = items => this.setState({ items });
// 
//   moveItem = (sourceId, destinationId) => {
//     const sourceIndex = this.state.items.findIndex(
//       item => item.id === sourceId
//     );
//     const destinationIndex = this.state.items.findIndex(
//       item => item.id === destinationId
//     );
// 
//     // If source/destination is unknown, do nothing.
//     if (sourceId === -1 || destinationId === -1) {
//       return;
//     }
// 
//     const offset = destinationIndex - sourceIndex;
// 
//     this.setState(state => ({
//       items: moveElement(state.items, sourceIndex, offset)
//     }));
//   };
// }
// 
export default GridContext;
