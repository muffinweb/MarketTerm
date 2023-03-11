const questions = [
  {
    type: 'list',
    name: "permissionToAction",
    message: "Do you want to use Doviz.com as a source and compare rates?",
    default: 'No',
    choices: ["Yes", "No"]
  },
  {
    type: 'list',
    name: "whichAsset",
    message: "Which asset do want to compare?",
    default: 'USD',
    choices: ["USD", "EUR", "Gold", "Silver"]
  },
  {
    type: 'list',
    name: "sortingOption",
    message: "Would you like to sort results by Sell Lowest, Buy Highest, Exchange diff lowest?",
    default: 'Doviz.com',
    choices: ["Yes", "No"]
  }
];

export default questions;