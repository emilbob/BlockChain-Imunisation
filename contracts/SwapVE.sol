pragma solidity ^0.8.0;

import "./Vcc.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "hardhat/console.sol";

contract SwapVE{

    address public vcc;
    Vcc VccInstance;

    address public router;
    IUniswapV2Router01 Router;

    address public factory;
    IUniswapV2Factory Factory;

    constructor(address _vcc, address _router, address _factory){
        vcc=_vcc;
        VccInstance = Vcc(vcc);

        factory = _factory;
        Factory = IUniswapV2Factory(factory);

        router = _router;
        Router = IUniswapV2Router01(router);
    }

    function myPair()public returns(address){

        address eth = Router.WETH();
        address pairAddress =  Factory.createPair(vcc, eth);

        console.log("adresa je ",  pairAddress);

        //kreira par na ovoj adresi: 0x21baa4b957c3e060f2908aa28ff2f3a885e1a128

         return pairAddress;

    
    }

    function swapVccForETH( uint amountIn, uint amountOutMin) external{
        VccInstance.transferFrom(msg.sender, address(this), amountIn);                                 //prvo prebacimo na contract
        address[] memory path = new address[](2);
        path[0] = vcc;
        path[1] = Router.WETH();                                                                        //vraca adresu wetha
        VccInstance.approve(address(Router), amountIn);
        Router.swapExactTokensForETH(amountIn, amountOutMin, path, msg.sender, block.timestamp);
    }

    function swapVccForAsset(address asset, uint amountIn, uint amountOutMin)external{

        require(amountIn <= VccInstance.balanceOf(address(this)), "Incufficient funds");

        address[] memory path = new address[](2);
        path[0] = vcc;
        path[1] = asset;

        VccInstance.approve(address(Router), amountIn);

        Router.swapExactTokensForTokens(amountIn, amountOutMin, path, msg.sender, block.timestamp);

    }

}

        
