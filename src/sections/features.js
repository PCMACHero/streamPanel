import React, {Fragment} from 'react'

// class Listing extends React.Component{
//     render(){
//         return (
//             <Fragment>
//                 div.listing
//             </Fragment>
//         )
//     }
// }

export default class Features extends React.Component{
    array = this.props.array
    state={
        divs:[]
    }
    divArray = []
    makeDivs=()=>{
        for (let j = 0; j < this.array.length; j++){
            this.divArray.push(<div key={j}className="feature"><div className="feature-left">{this.array[j]}</div><div key={j}className="feature-right"><div className="check"><i className="material-icons" style={{color:"#3DEC61"}}>
            check
            </i></div></div></div> )
        }
        this.setState({
            divs: this.divArray
        })
    }
    componentDidMount(){
        this.makeDivs()
    }
    render(){
        return (
            <div className="features-container">
                <div className="features-box">
                    <div className="features-title">
                        <div className="features-title-left">{this.props.title}</div>
                        
                        <div className="features-title-right">FREE VERSION</div>
                    </div>
                    <div className="items-box">
                        {this.divArray}
                    </div>
                </div>
            </div>
        )
    }
}