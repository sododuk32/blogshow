
console.log('[SharedWorker] loaded');


const activePorts = new Set();

onconnect = (e) => {
  const port = e.ports[0];
  let manager = new RTStore(port);
  console.log('[SharedWorker] port connected, total ports =',  e.ports.length);

  port.addEventListener("message", (e) => {

    const { topic, detail, isStock,type  } = e.data;
    let RESULT;
    switch(type){
      case'delete':{
        RESULT=manager.deletePaper(topic,detail) 
        break;
      }
      case'subscribe':{ 
        RESULT = manager.addPaper(e.data)
        break;
      }
      case 'disconnect':{
          activePorts.delete(port);
          console.log('[SharedWorker] port disconnected, remaining =', activePorts.size);

      }
    }
     port.postMessage(manager.allRequestForm);
  });



  port.start();
 activePorts.add(port);
};
export {};
 


class RTStore {
  
  allRequestForm;
  newConnection;
  constructor(port){
      this.allRequestForm = {};
      this.url = 'ws://localhost:4433'; 
      this.socket= null;      
      this.requestQueue =[];
      this.currentPort = port|| null;
  }
  ensureConnection() {

    const wsinstance = this.socket;
        console.log("wsinstance = "+ wsinstance)


    const isDead = !wsinstance
    || wsinstance.readyState === WebSocket.CLOSING
    || wsinstance.readyState === WebSocket.CLOSED;
    console.log("isdead +" + isDead)
    if (!isDead) return; 

  try {


    this.socket = new WebSocket('ws://localhost:4433');
    this.socket.addEventListener('open', () => {
      console.log(this.requestQueue[0]);
      
      this.requestQueue.forEach(msg => this.socket.send(msg));
      this.requestQueue = [];
    }); 
      this.socket.addEventListener('close', () => {
      console.log('[SharedWorker] socket closed');
      this.socket = null;
    });
    this.socket.addEventListener('error', err => {
      console.error('WebSocket error', err);
    });
     this.socket.addEventListener('message', data => {
      const result = JSON.parse(data.data)
      console.log('WebSocket data', result);
      this.currentPort.postMessage(result)


    });

  } catch (error) {
            console.log(error);
          }
  }

  // 준비 안 됐으면 큐에, 아니면 즉시 전송
  sendRequest(obj) {
    const payload = JSON.stringify(obj);
    
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(payload);
    } else {
      this.requestQueue.push(payload);
      this.ensureConnection();
    }  
 
    
  }
  addPaper(paper){
    const {detail,isStock,type,topic} = paper;

  if(isStock){

    for(const topics in this.allRequestForm)
    {
      const types = this.allRequestForm[topics];

      /** types 객체에서 isStock === false인 항목만 걸러서 새 객체로 만듬  */
    const filtered = {};
    for (const [subscribedTopic, subscriptionData] of Object.entries(types)) {
      if (!subscriptionData.isStock) {
        filtered[subscribedTopic] = subscriptionData;
      }
    }
     
      /** topic이 하나라도 존재하면  */
      if (Object.keys(filtered).length) {
            this.allRequestForm[topic] = filtered;

            // 대체
      } else {
            
            delete this.allRequestForm[topic];
            this.sendRequest({ type: 'delete', topic: topic, detail: detail });
            // 제거
      }

    }
 

    this.allRequestForm[topic] = { [detail]: paper };
    this.sendRequest({ type: 'subscribe', topic, detail, isStock: true });

    // 생성

  }
  else {
   const prev = this.allRequestForm[topic] || {};
   
    prev[detail] = paper;
    this.allRequestForm[topic] = prev;
  }
 

  return this.allRequestForm
  }
   deletePaper(topic,detail){
    const topicObj = this.allRequestForm[topic] ?? {}
    delete topicObj[detail];
    
    if(Object.keys(this.allRequestForm[topic]).length === 0)
    {
      delete this.allRequestForm[topic];
    }else {

    }

    return this.allRequestForm[topic]
  }

}