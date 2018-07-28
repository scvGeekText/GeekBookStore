import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import TitleHeader from "./BookPageComps/TitleHeader";
import BookImage from "./BookPageComps/BookImage";
import ProductDescription from "./BookPageComps/ProductDescription";


class bookPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bookId: '',
      Url: '',
      Name: '',
      Rating: '',
      Description: '',
      Price: '',
      AuthId: '',
      Bio: '',
      AuthName:'',
      relatedBooks: [],
      Comments: []
      }
  }
  componentDidMount() {
    const { bookId } = this.props.match.params
    fetch(`http://localhost:8080/book/${bookId}`).then(results => {
      return results.json()
    }).then(data => {
      console.log('data:', data)
      const { Name, Url, Price, Rating, Description, AuthId, Comments } = data.BookArray[bookId]

      console.log({Comments})
      this.setState({
          Name,
          Url,
          Price,
          Rating,
          Description,
          AuthId,
          Comments
      })
      //console.log('Name1:', this.state.AuthId)
      const authorId = this.state.AuthId
      fetch(`http://localhost:8080/author/${authorId}`).then(results => {
        return results.json()
      }).then(data => {
        //console.log('data', data)

        //console.log('Bio:', data.AuthorArray[2].Bio)
        //console.log('test: ', {authorId})
        const Bio= data.AuthorArray[authorId].Bio
        const AuthName = data.AuthorArray[authorId].Name
        //console.log('Bio: ', {Bio})

        this.setState({
            Bio,
            AuthName
        })
        //console.log('State: ', this.state)
      })

      fetch('http://localhost:8080/book').then(results => {
        return results.json()
      }).then(data => {
        console.log('data', data)
        var arrayLength = Object.keys(data).length;
        let relatedBooks = []
        for (var i in data) {
          if (!data.hasOwnProperty(i)) continue
          //console.log('dataIds: ',data[i].AuthId)
          //console.log('stateId: ', this.state.AuthId)
          if (data[i].AuthId == this.state.AuthId){
          //console.log('got here')
            relatedBooks.push(data[i])
            }
        }
        this.setState({
          relatedBooks
        })
        console.log('State: ', this.state)
      });
    })
  }



  render() {
    if (!this.state.Name) {
      return <p>Loading...</p>
    }

    return(

      <div className="container">
        <TitleHeader name={this.state.Name}></TitleHeader>
        <div className="row">
          <div className="col-lg">
          <BookImage Url={this.state.Url}></BookImage>
          </div>
          <div className="col-md">
          <ProductDescription price={this.state.Price} rating={this.state.Rating} description={this.state.Description} authorName={this.state.AuthName} bio={this.state.Bio} relatedBooks={this.state.relatedBooks} Comments={this.state.Comments}> </ProductDescription>
          </div>
        </div>

        </div>


    );
  };
};

export default bookPage;
