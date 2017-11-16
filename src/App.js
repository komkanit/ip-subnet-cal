import React, { Component } from 'react';
import classNames from 'classnames';
import AllPossibleTable from './AllPossibleTable';
import {
  networkClassSplit,
  isIPv4,
  ipToNetAddress,
  usableHost,
  ipToBroadcast,
  convertToSubnet,
  wildCard,
  binarySubnet,
  isPrivate,
  decimalToBinary,
  decimalIp,
  ipToHex,
  getAllPossible,
  ipClass,
  getPossibleText,
} from './utils/helper';

class App extends Component {
  state = {
    ip: '158.108.1.1',
    classIp: 'any',
    subnet: [],
    mask: 32,
    changed: true,
  }
  componentDidMount = () => {
    this.setState({
      subnet: networkClassSplit(this.state.classIp),
    });
  }
  onInputChange = (e) => {
    this.setState({
      ip: e.target.value,
      changed: true,
    });
  }
  setClass = (e) => {
    this.setState({
      classIp: e.target.value,
      subnet: networkClassSplit(e.target.value),
      changed: true,
    });
  }
  calculateIp = () => {
    const { ip, mask } = this.state;
    if(isIPv4(ip)) {
      this.setState({
        changed: false,
        find: true,
        netAddress: ipToNetAddress(ip, mask),
        usableHost: usableHost(ip, mask),
        broadcast: ipToBroadcast(ip, mask),
        subnetMask: convertToSubnet(mask),
        wildCard: wildCard(mask),
        binarySubnetMask: binarySubnet(mask),
        isPrivate: isPrivate(ip),
        allPossible: getAllPossible(ip, mask),
        ipClass: ipClass(mask),
      })
    }
  }
  onSelectChange = (e) => {
    this.setState({
      mask: e.target.value,
      changed: true,
    });
  }
  render() {
    const { classIp, ip, subnet } = this.state;
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="page-header">
              <h1>IP Subnet Calculator</h1>
            </div>
            <div className="input-field">
              <div className="form-group">
                <label>IP Address</label>
                <input
                  type="text"
                  className="form-control"
                  onChange={this.onInputChange}
                  value={ip}
                />
              </div>
              <div className="form-group">
                <label>Network Class</label>
                <div></div>
                <label className="radio-inline">
                  <input checked={classIp === 'any'} type="radio" value="any" name="class" onChange={this.setClass}/>
                  Any
                </label>
                <label className="radio-inline">
                  <input checked={classIp === 'a'} type="radio" value="a" name="class" onChange={this.setClass}/>
                  A
                </label>
                <label className="radio-inline">
                  <input checked={classIp === 'b'} type="radio" value="b" name="class" onChange={this.setClass}/>
                  B
                </label>
                <label className="radio-inline">
                  <input checked={classIp === 'c'} type="radio" value="c" name="class" onChange={this.setClass}/>
                  C
                </label>
              </div>
              <div className="form-group">
                <label>Subnet</label>
                <select className="form-control" onChange={this.onSelectChange}>
                  {
                    subnet.map((sub, index) => {
                      return (<option key={index} value={32 - index}>{sub}</option>)
                    })
                  }
                </select>
              </div>
              <button
                className={classNames('btn', this.state.changed ? 'btn-success' : 'btn-default')}
                onClick={this.calculateIp}>
                Calculate{!this.state.changed && 'd!'}
              </button>
            </div>
            {
              this.state.find &&
              <table className="table table-striped">
                <tbody>
                  <tr>
                    <td>IP Address</td>
                    <td>{ip}</td>
                  </tr>
                  <tr>
                    <td>Network Address</td>
                    <td>{this.state.netAddress}</td>
                  </tr>
                  <tr>
                    <td>Usable Host IP Range</td>
                    <td>
                      {
                      decimalIp(this.state.usableHost.start) <= decimalIp(this.state.usableHost.end) ?
                        `${this.state.usableHost.start} - ${this.state.usableHost.end}`
                        :
                        'None'
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>Broadcast Address</td>
                    <td>{this.state.broadcast}</td>
                  </tr>
                  <tr>
                    <td>Total Number of Hosts</td>
                    <td>{this.state.usableHost.totalHost}</td>
                  </tr>
                  <tr>
                    <td>Number of Usable Hosts</td>
                    <td>{this.state.usableHost.usableHostTotal}</td>
                  </tr>
                  <tr>
                    <td>Subnet Mask</td>
                    <td>{this.state.subnetMask}</td>
                  </tr>
                  <tr>
                    <td>Wildcard Mask</td>
                    <td>{this.state.wildCard}</td>
                  </tr>
                  <tr>
                    <td>Binary Subnet Mask</td>
                    <td>{this.state.binarySubnetMask}</td>
                  </tr>
                  <tr>
                    <td>IP Class</td>
                    <td>
                      {
                        this.state.ipClass === 'ANY' ?
                        'None'
                        :
                        this.state.ipClass
                      }
                    </td>
                  </tr>
                  <tr>
                    <td>CIDR Notation</td>
                    <td>/{this.state.mask}</td>
                  </tr>
                  <tr>
                    <td>IP Type</td>
                    <td>{this.state.isPrivate ? 'Private' : 'Public'}</td>
                  </tr>
                  <tr>
                    <td>Short</td>
                    <td>{this.state.ip}/{this.state.mask}</td>
                  </tr>
                  <tr>
                    <td>Binary ID</td>
                    <td>{decimalToBinary(decimalIp(this.state.ip))}</td>
                  </tr>
                  <tr>
                    <td>Integer ID</td>
                    <td>{decimalIp(this.state.ip)}</td>
                  </tr>
                  <tr>
                    <td>Hex ID</td>
                    <td>{ipToHex(this.state.ip)}</td>
                  </tr>
                </tbody>
              </table>
            }
            {
              this.state.find &&
              <div>
                <div className="page-header">
                  <h2>{getPossibleText(ip, this.state.mask)}</h2>
                </div>
                <AllPossibleTable allPossible={this.state.allPossible} />
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
