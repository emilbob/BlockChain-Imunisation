pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Vcc is ERC20, ReentrancyGuard {
    
    address public owner;
    
    enum personState {antivaxer, vaccinated, booster}
    
    uint public personIndex;
    uint public population;

   // personIndex => Person
    
    mapping(uint => Person) people;
    
    struct Person{
        address personAddress;
        string name;
        Vcc.personState state;
        uint vaccineTime;
        uint payOut;
        
    }
    
    
    modifier onlyOwner {
      require(msg.sender == owner, "Only contract owner can call this function");
      _;
   }
    
    
     modifier herdImmunity {
      require(personIndex <= population / 5 * 4, "No more tokens for your nation");
      _;
   }

    
    event vaccinationMsg( address _indexed, string message);
    
    
    constructor(uint _population)ERC20('Vaccine coin', 'VCC') {
        
         population = _population;
         owner = msg.sender;

         
    }

    //EXTERNAL METHODS
     
      function register(address _address,string memory _name,  personState _state)external{
         
         people[personIndex].personAddress = _address;
         people[personIndex].name = _name;
         people[personIndex].state = _state;
         personIndex++;

         if(people[personIndex].state == personState.antivaxer){

        emit vaccinationMsg(people[personIndex].personAddress, "Take vaccine to collect VCC tokens");

         }
     }
     
     
    function vaccinate(uint _index)external  nonReentrant herdImmunity{
        require (people[_index].state == personState.antivaxer, 'You didnt take vaccine yet');
         
         people[_index].state = personState.vaccinated;
         
         _mint(people[_index].personAddress, 2 * (10 ** 6));

         personIndex++;
         
         emit vaccinationMsg(people[personIndex].personAddress, "Congrats, you have earned 2 vcc toknes by taking vaccine");
         
         }
     
       function boost(uint _index)external  nonReentrant herdImmunity{
         require (people[_index].state == personState.vaccinated, 'It has passed 6 months, you should take booster dose');
         
         people[_index].state = personState.booster;
         people[_index].vaccineTime = block.timestamp;

         _mint(people[_index].personAddress, 1 * (10 ** 6));

         emit vaccinationMsg(people[personIndex].personAddress, "Congrats, you have earned 1 vcc token, you can expect your daily tokens every 24h");

         recursivePayment( _index);   //da li treba da pozivam ovu funkciju?
     }

     //INTERNAL METHODS
     
     function recursivePayment(uint _index)internal herdImmunity{
       
        for(uint i=24 hours; i <=  1095 days ; i++){
          if(people[_index].payOut ==  people[_index].vaccineTime + i  ){
            _mint(people[_index].personAddress, 1 * (10 ** 6));
            emit vaccinationMsg(people[personIndex].personAddress, "You have received your daily vcc token");
          }
        }
    }

    //GETTERS

    function getIndex()public view returns(uint ){
      return personIndex;
    }

    function getPopulation()public view returns(uint ){
      return population;
    }

    function getperson(uint _index)public view returns(address, string memory, Vcc.personState ,uint , uint ){

      Person memory person = people[_index];

      return(msg.sender, person.name, person.state, person.vaccineTime, person.payOut);

    }
}