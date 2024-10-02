import * as React from 'react';
import Box from '@mui/material/Box';
import MUISlider from '@mui/material/Slider';
import {useState} from 'react';


export default function Slider({stateBankOfReact, id, dispatch}){
// testing input
  // //console.log(stateBankOfReact, id);
let [silderCurrentValue, updateSliderCurrentValue] = useState(stateBankOfReact[id].current);

// helper functions
  // to convert currency into lakhs and crores
  let convertCurrencyIntoLakhsCrores = (currency)=>{
    let formattedCurrency = '₹ 0';
    if(currency >= 100000 && currency <= 9999999){
      formattedCurrency = currency/100000;
      formattedCurrency = `₹ ${formattedCurrency} ${formattedCurrency >1 ? 'Lakhs' : 'Lakh'}`;
    }else if(currency >= 10000000){
      formattedCurrency = currency/10000000;
      formattedCurrency = `₹ ${formattedCurrency} ${formattedCurrency >1 ? 'Crores' : 'Crore'}`;
    }else{
      formattedCurrency = `₹ ${currency}`;
    }
    return formattedCurrency;
  }

// Returning JSX
  return (  
    <div  className="w-[20rem]" >
      <label 
        htmlFor={stateBankOfReact[id]} 
        className=" labelSlider font-semibold text-[1.8rem]"        
      >
        {stateBankOfReact[id].name}<br/><span className='font-normal'>{convertCurrencyIntoLakhsCrores(stateBankOfReact[id].current)}</span>
      </label>


      <Box className='sliderBox w-[20rem]'>
        <MUISlider
          aria-label="Small steps"
          defaultValue={silderCurrentValue}
          step={(stateBankOfReact[id].max-stateBankOfReact[id].min)/10 <= 0 ? 1 : Math.floor(stateBankOfReact[id].max-stateBankOfReact[id].min)/10}
          marks
          min={stateBankOfReact[id].min}
          getAriaValueText={convertCurrencyIntoLakhsCrores}
          max={stateBankOfReact[id].max}
          valueLabelDisplay="auto"
          onChange={(e)=>{
            dispatch({request:'updateValue', id:id, newCurrentValue:e.target.value})
          }}
          id={stateBankOfReact[id]}
          
        />
      </Box>



      <div className="flex justify-between text-gray-300 italic spansRangeLabels">
        <span>{stateBankOfReact[id].min < 1000000 ? stateBankOfReact[id].min : convertCurrencyIntoLakhsCrores(stateBankOfReact[id].min)}</span>
        <span>{stateBankOfReact[id].max < 1000000 ? stateBankOfReact[id].max : convertCurrencyIntoLakhsCrores(stateBankOfReact[id].max)}</span>
      </div>
    </div>
    
  );
}

