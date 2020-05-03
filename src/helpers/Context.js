import { Socket } from './Phoenix';
function createContext(value){
  return { store: value };
}
const url = 'http://localhost:4000/socket';
const socket = new Socket(url, {});
let MyContext = createContext(socket);
export default MyContext;
