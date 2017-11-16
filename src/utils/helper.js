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
  const typeLength = {
    any: 1,
    a: 8,
    b: 16,
    c: 24,
  };
  const subnet = new Array(32 - typeLength[type] + 1).fill(0);
  return subnet.map((s, index) =>
    `${convertToSubnet(index + typeLength[type])} / ${index + typeLength[type]}`
  ).reverse();
}
const decimalIpToBinary = ip =>
  ip.split('.')
  .map(ipChar => '0'.repeat(8 - (+ipChar).toString(2).length) + (+ipChar).toString(2))
  .join('')

const binaryIpToDecimal = binary =>
  [0, 0, 0, 0].map((zero, index) => parseInt(binary.substr(index * 8, 8), 2))
  .join('.');

const decimalIp = ip => parseInt(decimalIpToBinary(ip), 2);

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
