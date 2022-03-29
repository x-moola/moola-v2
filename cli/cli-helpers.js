const BigNumber = require('bignumber.js');
const ethers = require('ethers');
const Promise = require('bluebird');

const { INTEREST_RATE, RAY } = require('./cli-constants');

const BN = (num) => {
  return new BigNumber(num);
};

const print = (num) => {
  return BN(num).dividedBy(ETHER).toFixed();
};

const printRay = (num) => {
  return BN(num).dividedBy(RAY).toFixed();
};

const printRayRate = (num) => {
  return BN(num).dividedBy(RAY).multipliedBy(BN(100)).toFixed(2) + '%';
};

const nowSeconds = () => {
  return Math.floor(Date.now() / 1000);
};

const isValidRateMode = (rateMode) => {
  if (!rateMode || !INTEREST_RATE[rateMode.toUpperCase()]) {
    console.error('rateMode can be only "stable|variable"');
    return false;
  }

  return true;
};

const getRateModeNumber = (rateMode) => {
  return INTEREST_RATE[rateMode.toUpperCase()];
};

const isNumeric = (num) => {
  if (isNaN(num)) {
    console.error(`invalid number ${num}`);
    return false;
  }
  return true;
};

const isValidBoolean = (boolStr) => {
  if (boolStr !== 'true' && boolStr !== 'false') {
    console.error('boolean values can be only true|false');
    return false;
  }
  return true;
};

const retry = async (fun, tries = 5) => {
  try {
    return await fun();
  } catch (err) {
    if (tries == 0) throw err;
    await Promise.delay(1000);
    return retry(fun, tries - 1);
  }
};

const buildLiquiditySwapParams = (
  assetToSwapToList,
  minAmountsToReceive,
  swapAllBalances,
  permitAmounts,
  deadlines,
  v,
  r,
  s,
  useEthPath,
  useATokenAsFrom,
  useATokenAsTo
) => {
  return ethers.utils.defaultAbiCoder.encode(
    [
      'address[]',
      'uint256[]',
      'bool[]',
      'uint256[]',
      'uint256[]',
      'uint8[]',
      'bytes32[]',
      'bytes32[]',
      'bool[]',
      'bool[]',
      'bool[]',
    ],
    [
      assetToSwapToList,
      minAmountsToReceive,
      swapAllBalances,
      permitAmounts,
      deadlines,
      v,
      r,
      s,
      useEthPath,
      useATokenAsFrom,
      useATokenAsTo,
    ]
  );
};

const buildSwapAndRepayParams = (
  collateralAsset,
  collateralAmount,
  rateMode,
  permitAmount,
  deadline,
  v,
  r,
  s,
  useEthPath,
  useATokenAsFrom,
  useATokenAsTo
) => {
  return ethers.utils.defaultAbiCoder.encode(
    [
      'address',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'uint8',
      'bytes32',
      'bytes32',
      'bool',
      'bool',
      'bool',
    ],
    [
      collateralAsset,
      collateralAmount,
      rateMode,
      permitAmount,
      deadline,
      v,
      r,
      s,
      useEthPath,
      useATokenAsFrom,
      useATokenAsTo,
    ]
  );
};

module.exports = {
  BN,
  print,
  printRay,
  printRayRate,
  nowSeconds,
  buildLiquiditySwapParams,
  buildSwapAndRepayParams,
  isValidRateMode,
  getRateModeNumber,
  isNumeric,
  isValidBoolean,
  retry,
};
