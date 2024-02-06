
import { View ,Text, CheckBox, Button} from 'react-native-web';
import { FlatList } from "react-native"
import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native-web';
import axios from "axios";

function App() {
  const [data,setData] = useState(null)
  const [incr,setIncr] = useState(1)
  const [editbuton,setEditButton] = useState(false)
  console.log("started")
  const [selected,setSelected] = useState({
    lastname: "",
	firstname: "",
	email: "",
	hide: false,
	id: ""
  });
  const headers = {
   'x-origin-app': 'syamapp',
    'mode': 'cors'
  };
  useEffect(()=>{
    axios.get('http://localhost:8080/getAlldbUser',{ headers })
    .then((res) => {
      console.log(res)
      console.log(res.data)
      setData(res.data)
    })
  },[incr])

  const handleChange = (e) => {
    const value = e.target.value;
    
    setSelected({
      ...selected,
      [e.target.name]: value
    });
  };

  const handleHide = (e) => {
    const value = e.target.value;
    setSelected({
      ...selected,
      [e.target.name]: value
    });
  };
  const flip = () => { 
    editbuton ? <button onPress={updateUser}>Edit</button>:<button type="submit">Add</button>}
  const addUser = (e) => {
    //e.preventDefault();
    const userData = {
      lastname: selected.lastname,
      firstname: selected.firstname,
      email: selected.email,
      hide: selected.hide,
      id: ""
    };
    axios.put("http://localhost:8080/addDbuser", { headers }, userData ).then((response) => {
      console.log(response.status, response.data);
    });

    setIncr(incr+1);
  };

  const updateUser = (e) => {
    //e.preventDefault();
    const userData = {
      lastname: selected.lastname,
      firstname: selected.firstname,
      email: selected.email,
      hide: selected.hide,
      id: selected.id
    };
    axios.post("http://localhost:8080/updateDbuser", { headers }, userData).then((response) => {
      console.log(response.status, response.data);
    });
    setEditButton(false)
    setSelected({
      lastname: "",
    firstname: "",
    email: "",
    hide: false,
    id: ""
    })
    setIncr(incr+1);
  };

  const deleteUser = (e) => {
   
    axios.delete(`http://localhost:8080/removeDbuser/${e.email}`,{ headers } ).then((response) => {
      console.log(response.status, response.data);
    });
    console.log(e);
    setIncr(incr+1);
  }

  return (
    <div className="App">

        <View>
          <View>
            <Text>User Deatils</Text>
            <form onSubmit={addUser}> 
            
            <View style={{flexDirection: 'row'}}><label>Last Name</label><input type ="text" name="lastname" value={selected?selected.lastname:''} onChange={handleChange}/> </View>
            <View style={{flexDirection: 'row'}}><label>First Name</label><input type ="text" name="firstname" value={selected?selected.firstname:''} onChange={handleChange}/> </View>
            <View style={{flexDirection: 'row'}}><label>Email</label><input type ="email" name="email" value={selected?selected.email:''} onChange={handleChange}/> </View>
            <View style={{flexDirection: 'row'}}><label>Hide</label><CheckBox  name="hide" value= {selected?selected.hide:false} onValueChange={value =>
                setSelected({
                  ...selected,
                  hide: value,
                })
              }/> </View>
             {useEffect(flip 
            ,[editbuton])}
            </form>
          </View>
        <table>
        <View style={{flexDirection: 'row', flex: 1, jestifyContent: "center", backgroundColor: 'gray'}}>
            <View style={{width: '20%'}}><Text>Last Name</Text></View>
            <View style={{width: '20%'}}><Text>First Name</Text></View>
            <View style={{width: '40%'}}><Text>Email</Text></View>
            <View style={{width: '20%'}}><Text>Action</Text></View>
        </View>
        <FlatList data = {data} 
        renderItem = {({item}) => (
          <View style={{flexDirection: 'row', flex: 1, jestifyContent: "center"}}>
            <View style={{width: '20%'}}><Text>{item.lastname}</Text></View>
            <View style={{width: '20%'}}><Text>{item.firstname}</Text></View>
            <View style={{width: '40%'}}><Text>{item.hide ?'****@***.***':item.email}</Text></View>
            <View style={{width: '20%'}}>
              <TouchableOpacity onPress = {() =>{ setSelected(item)}}><Text style= {{fontSize:10, color: 'black' }}>Edit</Text> </TouchableOpacity>
              <Text style= {{fontSize:10 , color: 'grey'}}>Hide</Text>
              <TouchableOpacity onPress = {() =>{ setSelected(item);deleteUser(item);}}><Text style= {{fontSize:10 , color: 'red'}} >Delete</Text></TouchableOpacity>
              </View>
        </View>
  )}
        > 
        
        </FlatList>
        </table>
        </View>

    </div>
  );
}

export default App;
