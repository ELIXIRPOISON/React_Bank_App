import Slider from "./Slider";
import SliderInterestRate from "./SliderInterestRate";
import { useReducer } from "react";
import MonthlyPaymentPieChart from "./MonthlyPaymentPieChart";

export default function BankOfReact(){
  let initialState = {
    homeValue:{
      id : 'homeValue',
      name: 'Home Value',
      min: 2500000,
      max: 10000000,
      current: 5000000
    },
    downPayment:{
      id : 'downPayment',
      name: 'Down Payment',
      min: 0,
      max: 5000000, // equals to current homeValue
      current: 2500000
    },
    loanAmount:{
      id : 'loanAmount',
      name: 'Loan Amount',
      min: 0,
      max: 5000000, // equals to current homeValue
      current: 2500000
    },
    interestRate:{
      id : 'interestRate',
      name: 'Interest Rate',
      min: 4,
      max: 18,
      current: 5
    },
    tenure:{
      all: [5,8,10,12,15,18,20,23,25,28,30], //in years
      current: 5
    },
    
    chartData : {
      principle: null,
      interest: null,
      monthlyPayment: null
    }  
  };

  function compute(stateBankOfReact){
    // interest/Month = interestRate / 100 / 12;
    let interestPerMonth  = stateBankOfReact.interestRate.current/1200;
    // -  monthlyPayment = (loanAmount * interestPerMonth *(1 + interestPerMonth) ** totalLoanMonths) / ((1 + interestPerMonth) ** totalLoanMonths - 1);
    let totalLoanMonths = stateBankOfReact.tenure.current * 12;
    let monthlyEMIPayment = (stateBankOfReact.loanAmount.current * interestPerMonth *(1+interestPerMonth) ** totalLoanMonths) / ((1+interestPerMonth) ** totalLoanMonths - 1);
    let totalInterestPaymentPaidOverTenure = (monthlyEMIPayment * totalLoanMonths) - stateBankOfReact.loanAmount.current;
    let principalAmount = stateBankOfReact.homeValue.current  - stateBankOfReact.downPayment.current;

    // updating
    stateBankOfReact.chartData.principle = principalAmount;
    stateBankOfReact.chartData.interest = totalInterestPaymentPaidOverTenure;
    stateBankOfReact.chartData.monthlyPayment = monthlyEMIPayment;
    // //console.log(interestPerMonth, monthlyEMIPayment, totalInterestPaymentPaidOverTenure, principalAmount);
  }


// using reducer to set initial state
  function reducer(state, action){
    // //console.log('reducer is called!', state, action);
    compute(state);
    //console.log('action id is', action.id, state);

    if(action.request === 'updateValue'){
      if(action.id === 'tenure'){
        //console.log('oh tenure!');
        return {
          ...state,
          ['tenure']:{
            ...state['tenure'],
            'current': action.newCurrentValue

          }
        }
      }else if(action.id === 'homeValue'){
        // recompute down payment and loan amount values
        // downpayment would be 20% of homevalue
        
        return {
          ...state,
          [action.id]:{          
            ...state[action.id],
            'current' : action.newCurrentValue
          },
          ['downPayment'] :{
            ...state['downPayment'],
            'current' : action.newCurrentValue * (20/100),
            'max' : action.newCurrentValue
          },
          ['loanAmount'] :{
            ...state['loanAmount'],
            'current' : action.newCurrentValue * (80/100),
            'max' : action.newCurrentValue
          }  
        };
      }else if(action.id === 'loanAmount'){
        // recompute down payment and loan amount values
        // downpayment would be 20% of homevalue
        
        return {
          ...state,
          [action.id]:{          
            ...state[action.id],
            'current' : action.newCurrentValue,
            'max' : state['homeValue']['current']
          },
          ['downPayment'] :{
            ...state['downPayment'],
            'current' : state['homeValue']['current'] - action.newCurrentValue,
            'max' : state['homeValue']['current']
          }  
        };
      } else if(action.id === 'downPayment'){
        // recompute down payment and loan amount values
        // downpayment would be 20% of homevalue
        
        return {
          ...state,
          [action.id]:{          
            ...state[action.id],
            'current' : action.newCurrentValue
          },
          ['loanAmount'] :{
            ...state['loanAmount'],
            'current' : state['homeValue']['current'] - action.newCurrentValue,
            'max' : state['homeValue']['current'] 
          }  
        };
      }


      // default return 

      //console.log('value is updated', action.id);
      return {
        ...state,
        [action.id]:{          
          ...state[action.id],
          'current' : action.newCurrentValue
        }

      };
    }

    // default is
      return state;
  }

  let [stateBankOfReact, dispatch] = useReducer(reducer, initialState);
  const data = [20, 30];
  const labels = ['Principle', 'Interest'];

  compute(stateBankOfReact);

  return (
    <div className="wrapperApp border-2 border-slate-200 p-[2rem] max-w-[50rem] mt-[2rem] m-auto rounded-md flex flex-col gap-[2rem] text-[1.2rem] text-slate-200">
      <header className="bg-blue-300 p-[1rem] rounded-md flex gap-[1rem] items-center">
        <div className="w-[15rem] h-[10rem]">
          <img className="w-[85%] h-[100%] object-cover" src={require('../Assests/Images/Bank.png')}/>
        </div>
        <h1 className="text-slate-900 font-bold text-[2rem]">React Bank App</h1>
      </header>
      <div id='wrapperChartAndSliders' className="flex justify-between">
        <div className="flex flex-col gap-[.5rem]">
          <Slider key={'homeValue'} stateBankOfReact={stateBankOfReact} id={'homeValue'} dispatch={dispatch}/>
          <Slider key={'downPayment'} stateBankOfReact={stateBankOfReact} id={'downPayment'} dispatch={dispatch}/>
          <Slider key={'loanAmount'} stateBankOfReact={stateBankOfReact} id={'loanAmount'} dispatch={dispatch}/>
          <SliderInterestRate key={'interestRate'} stateBankOfReact={stateBankOfReact} id={'interestRate'} dispatch={dispatch}/>
          <div className="flex gap-[1rem] items-center">
            <label htmlFor='tenure'>Tenure</label>
            <select 
                onChange={(e)=>{
                  dispatch({request:'updateValue', id:'tenure', newCurrentValue:e.target.value})
                }}
      
            id='tenure' className="bg-slate-700 focus:outline-none focus:ring focus:ring-emerald-700 p-[1rem] pb-[.5rem] placeholder:text-slate-200 pt-[.5rem] rounded-md text-xl text-zinc-50">            
              {
              stateBankOfReact.tenure.all.map((tenure, key)=>
              (<option key={key} value={tenure}>{tenure} years</option>)
              )}
            </select>
          </div>
        </div>
        <div id='monthlyPaymentPieChart'>
          <div className="monthlyPayment">
            Monthly Payment : ₹{Math.floor(stateBankOfReact.chartData.monthlyPayment)}
          </div>
          <MonthlyPaymentPieChart  data={[stateBankOfReact.chartData.principle, stateBankOfReact.chartData.interest]} labels={labels} />
        </div>
        
      </div>
    </div>
  );
}