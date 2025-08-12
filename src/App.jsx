import { useState,useEffect } from 'react'
import { Chatbot } from 'supersimpledev'
import './App.css'
import userpic from './assets/user pic.png'
import robotpic from './assets/robot pic.png'
import spin from './assets/spin.gif'
import { useRef } from 'react'

function App() {
  const [chatMessage,setChat]=useState(()=>{
    const saved=localStorage.getItem('messages');
    return saved?JSON.parse(saved):[];
  });

  useEffect(()=>{
    localStorage.setItem('messages',JSON.stringify(chatMessage));
  },[chatMessage])

  function handleclear(){
    setChat([]);
    localStorage.setItem('messages',JSON.stringify([]));
  }
  return (
    <> 
       <div className='inputandchatContainer'>
        
          <div className='userRobotchatcontainer' style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center'}} >
            <Chatmessages chatMessage={chatMessage}  />
          </div>
          <Chatinput chatMessage={chatMessage} setChat={setChat} handleclear={handleclear} />
      </div>  
    
      
     
    </>
  )
}


function Chatinput({setChat,handleclear}){
const [inputText,setInputtext]=useState('')
const [loading,setLoading]=useState(false);
const loadingkey='Loading-user-msg'
function saveinputText(event){
setInputtext(event.target.value)
}

async function sendMessage(){
   if(!inputText.trim()) return alert('Enter a Message');
  setLoading(true)
 
  const now=new Date();
setChat(chatMessage=>[
  ...chatMessage,
  {
    message:inputText,
    sender:'user',
    key:crypto.randomUUID(),
    time:now.toISOString(),
  },
    {
    message:<img className='spingif' src={spin} alt="spin" />,
    sender:'robot',
    key:loadingkey,
    time:now.toISOString(),
  }
]);
const response=await Chatbot.getResponseAsync(inputText);
setChat(chatMessage=>[
  ...chatMessage.slice(0,-1),
  // {
  //   message:inputText,
  //   sender:'user',
  //   key:crypto.randomUUID()
  // },
  {
    message:response,
    sender:'robot',
    key:crypto.randomUUID(),
    time:new Date()
  }
])
setInputtext('')
setLoading(false)
}
function onEnter(event){
if(event.key==='Enter'){
  sendMessage();
}
if(event.key==='Escape'){
  setInputtext('')
}

}
 
  return (
   
        <div className='chatinput'>
                  <input id='textinput' 
                    type="text" 
                    
                    placeholder='Send a message to Chatbot' 
                    size={30}
                    onChange={saveinputText}
                    value={inputText}
                    onKeyDown={onEnter}
                  />
                  <button onClick={sendMessage} 
                  className='sendbtn' disabled={loading}>Send</button>
                   <button className='sendbtn clear' onClick={handleclear}>Clear</button>
              </div>
     
  )
}

function Chatmessage(props){
//   let message=props.message;
// let sender=props.sender;
let {message,sender,time}=props;

/*if (sender==="robot") {
  return(
      <div className='userchatdiv'>
         
          <p className='messagetext'>{message}</p>
    </div>
  )
  
}
  */


let date=new Date(time);
let times=(time)=>String(time).padStart(2,'0');
let hours=date.getHours()
let min=date.getMinutes()

let period=hours>=12?'PM':'AM';
hours=hours%12;
hours=hours?hours:12;
const paddedhours=times(hours);
const paddedmin=times(min);


  return (
    <>
    <div className={`chatmessage ${sender==='user' ? 'user-message':'robot-message'}`}>
     
              {sender === "robot" &&  (
                <img className='Profileimage' 
                src={robotpic} 
                alt="userprofile" />
              )}
              <div className='messagetext'>
              <p >{message}</p>
              <p className='msgtime'>{paddedhours}:{paddedmin}{period}</p>
              </div>
             
               {sender === 'user' &&  (
                <img className='Profileimage' 
                src={userpic} 
                alt="userprofile" />
              )}
    </div>
      
    </>
  )
}
function Chatmessages({chatMessage}){
  const chatMessagesRef=useRef(null);
 useEffect(() => {
   const chatMsgElem=chatMessagesRef.current;
   if(chatMsgElem){
    chatMsgElem.scrollIntoView({behavior:'smooth'})
   }
  }, [chatMessage])
  
return (
  <div  className='chatmessagescontainer' >
    {chatMessage.length===0?(
      <p className='welcomemsg'>Welcome to chatbot project! Send a message using the textbox below</p>
    ):(
chatMessage.map((chatMessage =>(
        <Chatmessage
            message={chatMessage.message}
            sender={chatMessage.sender}
            time={chatMessage.time}
            key={chatMessage.key}
        />
         )
))
    )}
   <div ref={chatMessagesRef}></div>
  </div>
)
}
export default App
