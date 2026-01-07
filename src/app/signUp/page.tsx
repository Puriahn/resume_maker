'use client'
import { useState } from "react";
import PhoneNumber from './phoneNumber';

export default function signUp(){
    const [state,setState]=useState(1)
    
    if (state==1){
        return <div className="bg-[#ffffe3] h-screen pt-32"> <div className=" px-4 py-10 bg-[#6d8196] shadow-lg rounded-3xl sm:p-20 mx-5 md:max-w-xl md:mx-auto">

      <div className="max-w-md mx-auto">
        <div>
          <h1 className="text-2xl font-semibold">Login</h1>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
            <div className="relative">
              <input autoComplete="off" id="email" name="email" type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"  placeholder=""/>
              <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-100 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-200 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-300 peer-focus:text-sm">Email Address</label>
            </div>
            <div className="relative mt-6">
              <input autoComplete="off" id="password" name="password" type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600" placeholder="Password" />
              <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-100 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-200 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-300 peer-focus:text-sm">Password</label>
            </div>
            <div className="relative">
              <button className="bg-cyan-500 text-white rounded-md px-2 py-1">Submit</button>
            </div>
          </div>
        </div>
      </div>

    </div>
</div>
        
    }
    return <PhoneNumber />


}