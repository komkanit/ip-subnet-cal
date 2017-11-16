import { expect } from 'chai';
import {
  convertToSubnet,
  networkClassSplit,
  ipToNetAddress,
  ipToBroadcast,
  usableHost,
  wildCard,
  binarySubnet,
  ipClass,
  isPrivate,
  toDecimal,
  getAllPossible,
  isIPv4,
  getPossibleText,
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

describe('ipClass test', () => {
  it('should show type A', () => {
    expect(ipClass(7)).to.equal('ANY');
    expect(ipClass(1)).to.equal('ANY');
  })
  it('should show type A', () => {
    expect(ipClass(8)).to.equal('A');
    expect(ipClass(15)).to.equal('A');
  })
  it('should show type B', () => {
    expect(ipClass(16)).to.equal('B');
    expect(ipClass(23)).to.equal('B');
  })
  it('should show type C', () => {
    expect(ipClass(24)).to.equal('C');
    expect(ipClass(32)).to.equal('C');
  })
})

describe('isPrivate test', () => {
  it('ip should private', () => {
    expect(isPrivate('172.16.0.0')).to.equal(true);
    expect(isPrivate('172.16.225.20')).to.equal(true);
  })
  it('ip should public', () => {
    expect(isPrivate('172.60.225.20')).to.equal(false);
    expect(isPrivate('255.255.255.0')).to.equal(false);
  })
});

describe('toDecimal test', () => {
  it('should show decimal ip', () => {
    expect(toDecimal('255.255.255.0')).to.equal(4294967040);
  })
})

describe('getAllPossible test', () => {
  it('should get all possible', () => {
    const allPossible = getAllPossible('158.108.10.35', 1);
    const expected = [
      {
        netAddress: '0.0.0.0',
        broadcast: '127.255.255.255',
        usableHost: {
          start: '0.0.0.1',
          end: '127.255.255.254',
        },
      },
      {
        netAddress: '128.0.0.0',
        broadcast: '255.255.255.255',
        usableHost: {
          start: '128.0.0.1',
          end: '255.255.255.254',
        },
      }
    ]
    allPossible.map((possible, index) => {
      expect(possible.netAddress).to.equal(expected[index].netAddress);
      expect(possible.broadcast).to.equal(expected[index].broadcast);
      expect(possible.usableHost.start).to.equal(expected[index].usableHost.start);
      expect(possible.usableHost.end).to.equal(expected[index].usableHost.end);
    })
    // getAllPossible('158.108.10.35', 14);
  })
})

describe('isIPv4 test', () => {
  it('should return true', () => {
    expect(isIPv4('0.0.0.0')).to.equal(true);
    expect(isIPv4('255.255.255.255')).to.equal(true);
    expect(isIPv4('158.108.10.34')).to.equal(true);
  })
  it('should return false', () => {
    expect(isIPv4('0.0.0')).to.equal(false);
    expect(isIPv4('0.0.vv.aa')).to.equal(false);
    expect(isIPv4('-14.0.0.10')).to.equal(false);
  })
})

describe('getPossibleText test', () => {
  it('should show collect text', () => {
    expect(getPossibleText('158.108.1.1', 12)).to.equal('All Possible /12 Networks for 158.*.*.*');
    expect(getPossibleText('158.108.1.1', 32)).to.equal('All Possible /32 Networks for 158.108.1.*');
    expect(getPossibleText('158.108.1.1', 1)).to.equal('All Possible /1 Networks for *.*.*.*');
  })
})
