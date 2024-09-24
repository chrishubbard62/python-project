import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { redirect, useNavigate } from "react-router-dom";
import { createCoffeeThunk } from "../../redux/coffee";
import { createImage } from "../../redux/coffee";

const ROASTS = ['Light', 'Medium', 'Dark', 'Espresso']

function CoffeeFormPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0.00)
  const [description, SetDescription] = useState('')
  const [roast, setRoast] = useState('Select-A-Roast')
  const [region, setRegion] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [valErrors, setValErrors] = useState({})
  const [image, setImage] = useState(null)


  useEffect(() => {
    const errors = {}
    if(name.length < 1) errors.name = 'Please provide a name for your coffee'
    if(name.length > 50) errors.name = 'Coffee names are limited to 50 characters'
    if(price < .01) errors.price = 'Please provide a valid price for your coffee'
    if(description.length < 30) errors.description =  'Please describe your coffee in more that 30 characters'
    if(description.length > 500) errors.description = 'Please describe your coffee in less than 500 characters'
    if(!ROASTS.includes(roast)) errors.roast = 'Please select a valid roast'
    if(region.length < 1) errors.region = 'Please provide the a region for your coffee'
    if(region.length > 50) errors.region = 'Regions are limited to 50 characters'
    if(!image) errors.image = 'Please select an image for your coffee!'
    setValErrors(errors)

  }, [name, price, description, roast, region, image])



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if(Object.values(valErrors).length)  return;
    const coffee = {
      name,
      description,
      roast,
      region,
      price
    }
    const newCoffee = await dispatch(createCoffeeThunk(coffee))
    const formData = new FormData()
    console.log(image)
    formData.append("image", image)
    formData.append("coffee_id", newCoffee.id)
    await dispatch(createImage(formData))
    navigate(`/coffees/${newCoffee.id}`)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <p>Please enter the name of your coffee</p>
            <input
              type="text"
              name='name'
              placeholder="Coffee Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
        </div>
        <div>
          <p> Give a short description of your coffee
             (this might include flavor profiles or
             other interesting facts about
              your product!)
            </p>
            <textarea
              name="description"
              placeholder="Description"
              value={description}
              onChange={(e) => SetDescription(e.target.value)}
              />
        </div>
        <div>
          <p>Select a roast for the coffee</p>
          <select
            name="roast"
            value={roast}
            onChange={(e) => setRoast(e.target.value)}>
              <option value='Select-A-Roast'>Select-A-Roast</option>
              <option value='Light'>Light</option>
              <option value="Medium">Medium</option>
              <option value="Dark">Dark</option>
              <option value="Espresso">Espresso</option>
          </select>
        </div>
        <div>
          <p>What region was the coffee grown in?</p>
          <input
            type="text"
            name="region"
            placeholder="Region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            />
        </div>
        <div>
          <p>Enter a price for your coffee</p>
          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}/>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {image && <img src={URL.createObjectURL(image)} alt="preview" style={{width: '5rem'}}/>}
        </div>
      </form>
      <button onClick={handleSubmit}>Create Coffee</button>
    </div>
  )
}

export default CoffeeFormPage;
