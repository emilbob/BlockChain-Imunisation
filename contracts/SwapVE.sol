pragma solidity ^0.8.0;

import "./Vcc.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";

contract SwapVE{

    address public vcc;
    Vcc VccInstance;

    address public router;
    IUniswapV2Router01 Router;

    constructor(address _vcc, address _router){
        vcc=_vcc;
        VccInstance = Vcc(vcc);

        router = _router;
        Router = IUniswapV2Router01(router);
    }

    function swapVccForETH(address _VccInstance, uint amountIn, uint amountOutMin,  uint deadline) external{
        ERC20(_VccInstance).transferFrom(msg.sender, address(this), amountIn);
        address[] memory path = new address[](2);
        path[0] = address(_VccInstance);
        path[1] = Router.WETH();                                                                        //vraca adresu wetha
        ERC20(_VccInstance).approve(address(Router), amountIn);
        Router.swapExactTokensForETH(amountIn, amountOutMin, path, msg.sender, deadline);
    }
}