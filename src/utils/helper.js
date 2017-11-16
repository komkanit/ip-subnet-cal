const typeLength = {
  any: 1,
  a: 8,
  b: 16,
  c: 24,
};

export const convertToSubnet = (a) => {
  const subnet = [0, 0, 0, 0].map(() => {
    const sub = '00000000'.split('').map((zero) => {
      a -= 1;
      return a >= 0 ? '1' : '0';
    })
    return parseInt(sub.join(''), 2);
  });
  return subnet.join('.');
}

export const networkClassSplit = (type) => {
  const subnet = new Array(32 - typeLength[type] + 1).fill(0);
  return subnet.map((s, index) =>
    `${convertToSubnet(index + typeLength[type])} / ${index + typeLength[type]}`
  ).reverse();
}

const decimalIpToBinary = ip =>
  ip.split('.')
  .map(ipChar => '0'.repeat(8 - (+ipChar).toString(2).length) + (+ipChar).toString(2))
  .join('')

export const decimalToBinary = decimal =>
'0'.repeat(32 - decimal.toString(2).length) + decimal.toString(2)

const binaryIpToDecimal = binary =>
  [0, 0, 0, 0].map((zero, index) => parseInt(binary.substr(index * 8, 8) || 0, 2))
  .join('.');

export const decimalIp = ip => parseInt(decimalIpToBinary(ip), 2);

export const ipToNetAddress = (ip, subnet) => {
  const binaryIp = decimalIpToBinary(ip)
  .split('')
  .map(binaryChar => subnet-- > 0 ? binaryChar : '0')
  .join('');
  return binaryIpToDecimal(binaryIp);
}

export const ipToBroadcast = (ip, subnet) => {
  const binaryIp = decimalIpToBinary(ip)
  .split('')
  .map(binaryChar => subnet-- > 0 ? binaryChar : '1')
  .join('');
  return binaryIpToDecimal(binaryIp);
}

export const usableHost = (ip, mask) => {
  const netAddress = ipToNetAddress(ip, mask);
  const broadCast = ipToBroadcast(ip, mask);
  const decimalNetAddress = decimalIp(netAddress);
  const decimalBroadCast = decimalIp(broadCast);
  let usableHostTotal = decimalBroadCast - decimalNetAddress - 1;
  const totalHost = usableHostTotal + 2;
  if(decimalBroadCast === decimalNetAddress) {
    usableHostTotal = 0;
  }
  const usableHost = {
    start: binaryIpToDecimal((decimalNetAddress + 1).toString(2)),
    end: binaryIpToDecimal((decimalBroadCast - 1).toString(2)),
    usableHostTotal,
    totalHost,
  }
  return usableHost;
}

export const wildCard = (mask) => {
  const binary = '0'.repeat(mask) + '1'.repeat(32 - mask);
  return binaryIpToDecimal(binary);
}
export const binarySubnet = (mask) => {
  const subnetIp = convertToSubnet(mask);
  const binaryIp = decimalIpToBinary(subnetIp);
  return [0, 0, 0, 0].map((zero, index) => binaryIp.substr(index * 8, 8))
  .join('.');
}

export const ipClass = (mask) => {
  let classIp = '';
  Object.keys(typeLength).map((type) => {
    if (typeLength[type] <= mask) {
      classIp = type;
    }
    return type;
  })
  return classIp.toUpperCase();
}

export const toDecimal = ip => parseInt(decimalIpToBinary(ip), 2);

export const isPrivate = (ip) => {
  const privateLength = {
    a: {
      start: '10.0.0.0',
      end: '10.255.255.255',
    },
    b: {
      start: '172.16.0.0',
      end: '172.31.255.255',
    },
    c: {
      start: '192.168.0.0	',
      end: '192.168.255.255',
    },
  }
  const decimalIp = toDecimal(ip);
  return ['a', 'b', 'c'].reduce((prev, curr) => {
    if(decimalIp >= toDecimal(privateLength[curr].start) && decimalIp <= toDecimal(privateLength[curr].end)) {
      prev = true;
    }
    return prev;
  }, false);
}

export const ipToHex = (ip) => (toDecimal(ip)).toString(16)

const generatePossible = (decimalIp, jump) => {
  const plus = (2 ** jump) - 1;
  const usableHost = {
    start: binaryIpToDecimal(decimalToBinary(decimalIp + 1)),
    end: binaryIpToDecimal(decimalToBinary(decimalIp + plus - 1)),
  }
  const data = {
    netAddress: binaryIpToDecimal(decimalToBinary(decimalIp)),
    broadcast: binaryIpToDecimal(decimalToBinary(decimalIp + plus)),
    usableHost,
    next: decimalIp + plus + 1,
  }
  return data;
}
const checkClassToFix = (classIp) => {
  if(classIp === 'A') {
    return 9;
  } else if(classIp === 'B') {
    return 17;
  } else if(classIp === 'C') {
    return 25;
  }
  return 0;
}

export const getPossibleText = (ip, mask) => {
  const classIp = ipClass(mask);
  const checker = {
    'ANY': 0,
    'A': 1,
    'B': 2,
    'C': 3,
  };
  const ipCut = ip
  .split('.')
  .map((ip, index) => index < checker[classIp] ? ip : '*')
  .join('.');
  return `All Possible /${mask} Networks for ${ipCut}`;
}
export const getAllPossible = (ip, mask) => {
  const classIp = ipClass(mask);
  const binaryIp = decimalIpToBinary(ip);
  const fixDot = checkClassToFix(classIp);
  const binaryFix = binaryIp
  .split('')
  .map((bit, index) => index + 1 < fixDot ? bit : '0')
  .join('');
  const binaryFixMax = binaryIp
  .split('')
  .map((bit, index) => index + 1 < fixDot ? bit : '1')
  .join('');
  const allPossible = [];
  let decimalbinaryFix = parseInt(binaryFix, 2);
  const decimalbinaryFixMax = parseInt(binaryFixMax, 2);
  while(decimalbinaryFix <= decimalbinaryFixMax) {
    const data = generatePossible(decimalbinaryFix, 32 - mask);
    allPossible.push(data);
    decimalbinaryFix = data.next;
  }
  return allPossible;
}

export const isIPv4 = (ip) => {
  const regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return regex.test(ip);
}
