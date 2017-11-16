import React, { Component } from 'react';
import { networkClassSplit } from './utils/helper';

class App extends Component {
  state = {
    ip: '',
    mask: 'any',
    subnet: [],
  }
  onInputChange = (e) => {
    console.log(e.target.value);
    this.setState({
      ip: e.target.value,
    });
  }
  setMask = (e) => {
    console.log(e.target.value);
    this.setState({
      mask: e.target.value,
    });
  }
  calculateIp = () => {
    this.setState({
      subnet: networkClassSplit(this.state.mask),
    });
  }
  onSelectChange = (e) => {
    console.log(e.target.value);
  }
  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="page-header">
              <h1>IP Subnet Calculator</h1>
            </div>
            <div>
              <input type="text" onChange={this.onInputChange} value={this.state.ip}/>
              <button onClick={this.calculateIp}>submit</button>
            </div>
            <div>
              <input type="radio" value="any" name="mask" onChange={this.setMask}/>
              <label>Any</label>
              <input type="radio" value="a" name="mask" onChange={this.setMask}/>
              <label>A</label>
              <input type="radio" value="b" name="mask" onChange={this.setMask}/>
              <label>B</label>
              <input type="radio" value="c" name="mask" onChange={this.setMask}/>
              <label>C</label>
            </div>
            <div>
              <select onChange={this.onSelectChange}>
                {
                  this.state.subnet.map((sub, index) => {
                    return (<option value={32 - index}>{sub}</option>)
                  })
                }
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
