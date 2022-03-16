// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import {ERC20} from '../../../dependencies/openzeppelin/contracts/ERC20.sol';
import {Ownable} from '../../../dependencies/openzeppelin/contracts/Ownable.sol';
import '../../../protocol/lendingpool/LendingPoolConfigurator.sol';
import '../../../interfaces/ILendingPoolConfigurator.sol';

contract UBEConfiguratorAlfajores is Ownable {
  address constant lendingPoolConfiguratorAddress = 0x39fe2A4a4174bB5cAC5568ce0715a0b320bcB231;

  LendingPoolConfigurator public lendingPoolConfigurator =
    LendingPoolConfigurator(lendingPoolConfiguratorAddress);
  address constant assetAddress = 0x00Be915B9dCf56a3CBE739D9B9c202ca692409EC; // FIXME-- check the address

  bytes constant params = '0x10';
  bool constant stableBorrowRateEnabled = true;
  uint8 constant underlyingAssetDecimals = 18;
  address constant aTokenImpl = 0xe8B286649713447D8d5fBeBC28c731830d19B6C9;
  address constant stableDebtTokenImpl = 0xB6a5059A228a16Fa2827E28E52ceC96BBC63D639;
  address constant variableDebtTokenImpl = 0xB65b6a6a6F78E4daABF259c756567ae346699687;
  address constant interestRateStrategyAddress = 0x3C06Fb2f5Ab65b0e35F91073d88afE2b017D04b8;
  address constant treasury = 0x643C574128c7C56A1835e021Ad0EcC2592E72624;
  address constant incentivesController = 0x0000000000000000000000000000000000000000;
  string constant underlyingAssetName = 'Ubeswap';
  string constant aTokenName = 'Moola interest bearing UBE';
  string constant aTokenSymbol = 'mUBE';
  string constant variableDebtTokenName = 'Moola variable debt bearing mUBE';
  string constant variableDebtTokenSymbol = 'variableDebtmUBE';
  string constant stableDebtTokenName = 'Moola stable debt bearing mUBE';
  string constant stableDebtTokenSymbol = 'stableDebtmUBE';
  uint256 constant baseLTV = 5000; // TODO-- wait for params
  uint256 constant liquidationThreshold = 6500;
  uint256 constant liquidationThreshold = 6500;
  uint256 constant liquidationBonus = 11000;
  uint256 constant reserveFactor = 1000;

  function execute() external onlyOwner {
    createReserve();
    enableCollateral();
    enableBorrowing();
    setReserveFactor();

    selfdestruct(payable(treasury));
  }

  function destruct() external onlyOwner {
    selfdestruct(payable(treasury));
  }

  function createReserve() internal {
    ILendingPoolConfigurator.InitReserveInput[]
      memory inputs = new ILendingPoolConfigurator.InitReserveInput[](1);
    ILendingPoolConfigurator.InitReserveInput memory input = ILendingPoolConfigurator
      .InitReserveInput({
        aTokenImpl: aTokenImpl,
        stableDebtTokenImpl: stableDebtTokenImpl,
        variableDebtTokenImpl: variableDebtTokenImpl,
        underlyingAssetDecimals: underlyingAssetDecimals,
        interestRateStrategyAddress: interestRateStrategyAddress,
        underlyingAsset: assetAddress,
        treasury: treasury,
        incentivesController: incentivesController,
        underlyingAssetName: underlyingAssetName,
        aTokenName: aTokenName,
        aTokenSymbol: aTokenSymbol,
        variableDebtTokenName: variableDebtTokenName,
        variableDebtTokenSymbol: variableDebtTokenSymbol,
        stableDebtTokenName: stableDebtTokenName,
        stableDebtTokenSymbol: stableDebtTokenSymbol,
        params: params
      });
    inputs[0] = input;

    lendingPoolConfigurator.batchInitReserve(inputs);
  }

  function enableCollateral() internal {
    lendingPoolConfigurator.configureReserveAsCollateral(
      assetAddress,
      baseLTV,
      liquidationThreshold,
      liquidationBonus
    );
  }

  function enableBorrowing() internal {
    lendingPoolConfigurator.enableBorrowingOnReserve(assetAddress, stableBorrowRateEnabled);
  }

  function setReserveFactor() internal {
    lendingPoolConfigurator.setReserveFactor(assetAddress, reserveFactor);
  }
}
