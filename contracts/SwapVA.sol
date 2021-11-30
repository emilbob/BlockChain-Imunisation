pragma solidity ^0.8.0;

import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "./Vcc.sol";

contract swapVA{

    address public factory;
    IUniswapV2Factory Factory;
     
    address public vcc;
    Vcc VccInstance;

    constructor(address _vcc, address _factory){
        factory = _factory;
        Factory = IUniswapV2Factory(factory);
        vcc = _vcc;
        VccInstance = Vcc(_vcc);
    }

    function buyAsset(address asset, uint amount, uint _returns)external{

        address pair = Factory.getPair(vcc, asset);

        IUniswapV2Pair Pair = IUniswapV2Pair(pair);

        VccInstance.transfer(pair, amount);

        Pair.swap((vcc < asset) ? 0 : _returns, (vcc < asset) ? _returns : 0, msg.sender, "");

    }

}