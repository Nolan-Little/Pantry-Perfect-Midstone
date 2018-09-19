import React, { Component } from 'react';
import { Button, Header, Modal, Message } from 'semantic-ui-react';
import PurchasedItemCard from './PurchaseItemCard';
import QtyConverter from "../../modules/QtyConverter";
import DataManager from "../../modules/DataManager";
import "./groceryPurchaseForm.css";

export default class GroceryPurchaseForm extends Component {
    state = { 
        open: false,
        noChanges: false,
        newAmounts: []
    }

    addItemAmounts = (item) => {
        let newAmounts = this.state.newAmounts;
        if(newAmounts.find(u => u.groceryItemId === item.goceryItemId)){
            newAmounts = newAmounts.filter(u => u.groceryItemId !== item.groceryItemId)
            newAmounts.push(item)
            this.setState({newAmounts: newAmounts})
        } else {
            newAmounts.push(item)
            this.setState({newAmounts: newAmounts})
        }
    }

    updatePantry = () => {
        if(this.state.newAmounts.length === 0){
            this.setState({noChanges: true})
        } else {
            Promise.all(this.state.newAmounts.map(item => {
                let pItem = this.props.pantryItems.find(pItem => pItem.id === item.pantryItemId);
                let quantity = QtyConverter.convertToTSP(item.quantity, item.quantityType) + pItem.quantity;
                return DataManager.edit("pantryItems", item.pantryItemId, {quantity: quantity})
                .then(() => DataManager.delete("groceryItems", item.groceryItemId))
                .then(() => this.props.clearGrocery(item))
            }))
            .then(() => this.props.updatePantryItemState())
            .then(() => this.props.updateGroceryItemState())
            .then(() => this.setState({ open: false, noChanges: false, newAmounts: []}))
        }
    }

    show = dimmer => () => this.setState({ dimmer, open: true })
    close = () => this.setState({ open: false, noChanges: false, newAmounts: [] })

    render() {
        const { open, dimmer } = this.state

        return (
            <div>
                {
                    this.props.boughtGroceries.length === 0 &&
                    <Button positive icon='checkmark' labelPosition='right' content="Update Grocery List!" disabled onClick={this.show('blurring')} />
                }
                {
                    this.props.boughtGroceries.length > 0 &&
                    <Button positive icon='checkmark' labelPosition='right' content="Update Grocery List!" onClick={this.show('blurring')} />
                }
                <Modal dimmer={dimmer} open={open} onClose={this.close}>
                    <Modal.Header>Lets set the Pantry</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                        <Header>Purchased Items:</Header>
                        {
                            this.props.boughtGroceries.map(grocery => {
                                let pItem = this.props.pantryItems.find(p => p.id === grocery.pantryItemId)
                                return (
                                    <PurchasedItemCard key={`${grocery.id}-${pItem.id}`} pItem={pItem} grocery={grocery} quantityTypes={this.props.quantityTypes} pantryItems={this.props.pantryItems} addItemAmounts={this.addItemAmounts}/>
                                )
                            })
                        }
                        </Modal.Description>
                    </Modal.Content>
                    <Modal.Actions>
                        {
                            this.state.noChanges &&
                            <Message floating size="tiny" color='red' className="align-center">You didn't select anything to update!</Message>
                        }
                        <Button.Group>
                            <Button color='red' onClick={this.close}>Cancel</Button>
                            <Button.Or />
                            <Button color="green" icon='checkmark' labelPosition='right' content="Save" onClick={this.updatePantry} />
                        </Button.Group>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}