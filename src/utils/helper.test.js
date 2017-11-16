import { expect } from 'chai';
import {
  convertToSubnet,
  networkClassSplit,
  ipToNetAddress,
  ipToBroadcast,
  usableHost,
  wildCard,
  binarySubnet,
} from './helper';

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
    expect(ipToNetAddress('255.255.255.255', 32)).to.equal('255.255.255.255');
    expect(ipToNetAddress('255.255.255.255', 27)).to.equal('255.255.255.224');
  });
})

describe('ipToBroadcast test', () => {
  it('should show broad case address', () => {
    expect(ipToBroadcast('158.108.12.34', 21)).to.equal('158.108.15.255');
    expect(ipToBroadcast('255.255.255.255', 21)).to.equal('255.255.255.255');
    expect(ipToBroadcast('255.255.255.255', 32)).to.equal('255.255.255.255');
  });
})

describe('usableHost test', () => {
  it('should show usable host', () => {
    const expected = {
      start: '158.108.0.1',
      end: '158.108.1.254',
      usableHostTotal: 510,
      totalHost: 512,
    };
    expect(usableHost('158.108.1.24', 23).start).to.equal(expected.start);
    expect(usableHost('158.108.1.24', 23).end).to.equal(expected.end);
    expect(usableHost('158.108.1.24', 23).usableHostTotal).to.equal(expected.usableHostTotal);
    expect(usableHost('158.108.1.24', 23).totalHost).to.equal(expected.totalHost);
  });
  it('should show usableHost total 0 when start, end same', () => {
    expect(usableHost('158.108.1.24', 32).start).to.equal(usableHost('158.108.1.24', 32).start);
    expect(usableHost('158.108.1.24', 32).usableHostTotal).to.equal(0);
    expect(usableHost('158.108.1.24', 32).totalHost).to.equal(1);
  })
  it('should have 2 totalHost', () => {
    expect(usableHost('158.108.1.24', 31).start).to.equal(usableHost('158.108.1.24', 31).start);
    expect(usableHost('158.108.1.24', 31).usableHostTotal).to.equal(0);
    expect(usableHost('158.108.1.24', 31).totalHost).to.equal(2);
  })
})

describe('wildCard test', () => {
  it('should show wildcard mask', () => {
    expect(wildCard(15)).to.equal('0.1.255.255');
    expect(wildCard(1)).to.equal('127.255.255.255');

  });
  it('should show 0', () => {
    expect(wildCard(32)).to.equal('0.0.0.0');
  });
})

describe('binarySubnet test', () => {
  it('should show binarySubnet', () => {
    expect(binarySubnet(32)).to.equal('11111111.11111111.11111111.11111111');
    expect(binarySubnet(1)).to.equal('10000000.00000000.00000000.00000000');
    expect(binarySubnet(18)).to.equal('11111111.11111111.11000000.00000000');
  })
})
