
console.log('Worker! Loaded');




onconnect = (e) => {
  const port = e.ports[0];
  let manager = new RTStore();

  port.addEventListener("message", (e) => {

    const { topic, detail, isStock,type  } = e.data;
    let RESULT  = manager.addPaper(e.data)


    if(type==="delete")
    {
    RESULT=manager.deletePaper(topic,detail)

    }
     port.postMessage(manager.allRequestForm);
  });



  port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
};
export {};
 


class RTStore {
  
  allRequestForm;

  constructor(){
      this.allRequestForm = {};
  }

  addPaper(paper){
    const {detail,isStock,type,topic} = paper;

  if(isStock){
    for(const topics in this.allRequestForm)
    {
      const types = this.allRequestForm[topics];
      const filtered = Object.entries(types)
      .filter(([top,val])=> val.isStock !==true).reduce((acc, [k, p]) => ((acc[k] = p), acc), {});
     
      /** topic이 하나라도 존재하면  */
      if (Object.keys(filtered).length) {
            this.allRequestForm[topic] = filtered;
      } else {
            delete this.allRequestForm[topic];
      }

    }
    this.allRequestForm[topic] = { [detail]: paper };

  }
  else {
     const prevByType = this.allRequestForm[topic] ?? {};
     this.allRequestForm[topic] = { ...prevByType, [detail]: paper };
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