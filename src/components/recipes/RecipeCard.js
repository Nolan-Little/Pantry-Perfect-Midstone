import React, { Component } from "react";
import "./recipeCard.css";
import { Button, Divider, Message } from "semantic-ui-react";
import BuildGroceryList from "../grocerylist/BuildGroceryList";

export default class RecipeCard extends Component {
    state = {
        showDetails: false,
    }

    showDetails = () => {
        this.setState({showDetails: true})
    }

    hideDetails = () => {
        this.setState({showDetails: false})
    }

    render(){
        return (
            <div className="recipe-card">
                <div className="recipe-card-title">
                    <h3 className="recipe-title" onClick={this.showDetails}>{this.props.recipe.name}</h3>
                    <BuildGroceryList user={this.props.user} 
                            recipe={this.props.recipe} 
                            recipeItems={this.props.recipeItems} 
                            pantryItems={this.props.pantryItems} 
                            quantityTypes={this.props.quantityTypes} 
                            updateRecipeState={this.props.updateRecipeState}
                            updateGroceryItemState={this.props.updateGroceryItemState} 
                            updatePantryItemState={this.props.updatePantryItemState} />
                </div>
                {
                    this.state.showDetails &&
                    <div className="recipe-details">
                        <Divider horizontal>{this.props.recipe.name} Details</Divider>
                        <div>
                            <Button basic color="black" size="mini" onClick={this.hideDetails}>Hide</Button>
                        </div>
                        <p className="centered">{this.props.recipe.description}</p>
                        {
                            this.props.recipe.instructions &&
                            <div>
                                <Divider horizontal>Special Instructions</Divider>
                                <p>{this.props.recipe.instructions}</p>
                            </div>
                        }
                        <Divider horizontal>Ingredients from Pantry</Divider>
                        {
                            this.props.recipeItems.filter(recipeItem => recipeItem.recipeId === this.props.recipe.id).map(recipeItem => {
                                let ingredient = {
                                    name: this.props.pantryItems.find(pantryItem => pantryItem.id === recipeItem.pantryItemId).name,
                                    quantity: recipeItem.quantity,
                                    type: this.props.quantityTypes.find(type => type.id === recipeItem.quantityTypeId).name
                                }
                                return (
                                    <Message floating key={recipeItem.id} className="ingredient-card">
                                        <div>
                                            <p>{ingredient.name}</p>
                                        </div>
                                        <div>
                                            <p>{ingredient.quantity} {ingredient.type.toLowerCase()}</p>
                                            
                                        </div>
                                    </Message>
                                )
                            })
                        }
                        <Button basic color="black" size="mini" onClick={this.hideDetails}>Hide</Button>
                        <Divider />
                    </div>  
                }
            </div>
        )
    }
}