import { expect } from 'chai';
import { plus,
  convertToSubnet,
  networkClassSplit,
  ipToNetAddress,
  ipToBroadcast,
} from './helper';

describe('test plus', () => {
  it('should plus number', () => {
    expect(plus(1, 2)).to.equal(3);
    expect(plus(0, 2)).to.equal(2);
  })
})

describe('test convertToSubnet', () => {
  it('should convert to subnet', () => {
    expect(convertToSubnet(1)).to.equal('128.0.0.0');
    expect(convertToSubnet(2)).to.equal('192.0.0.0');
    expect(convertToSubnet(24)).to.equal('255.255.255.0');
    expect(convertToSubnet(15)).to.equal('255.254.0.0');
  });
})

describe('test networkClassSplit', () => {
  it('should show arry of subnet', () => {
    const expectedValue = [
      `${convertToSubnet(32)} / 32`,
      `${convertToSubnet(31)} / 31`,
      `${convertToSubnet(30)} / 30`,
      `${convertToSubnet(29)} / 29`,
      `${convertToSubnet(28)} / 28`,
      `${convertToSubnet(27)} / 27`,
      `${convertToSubnet(26)} / 26`,
      `${convertToSubnet(25)} / 25`,
      `${convertToSubnet(24)} / 24`,
    ]
    const value = networkClassSplit('c');
    value.map((subnet, index) => {
      expect(subnet).to.equal(expectedValue[index]);
    });
  });
})

describe('ipToNetAddress test', () => {
  it('should show network address', () => {
    expect(ipToNetAddress('159.108.12.111', 28)).to.equal('159.108.12.96');
    expect(ipToNetAddress('159.228.12.111', 13)).to.equal('159.224.0.0');
    expect(ipToNetAddress('158.108.12.34', 21)).to.equal('158.108.8.0');
  });
})

describe('ipToBroadcast test', () => {
  it('should show broad case address', () => {
    expect(ipToBroadcast('158.108.12.34', 21)).to.equal('158.108.15.255');
  });
})
