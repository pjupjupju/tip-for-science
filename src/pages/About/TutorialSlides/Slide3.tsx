import React from 'react';
import { Game } from "../../../components";
import slune from "../../../assets/slide2_elephant.jpg";

const Slide3 = () => <Game 
settings={{
  question: 'Kolik vážil největší známý slon?',
  image: slune,
  correctAnswer: 11000,
  unit: "kg"
}}
onSubmit={() => {console.log("cum sum!")}}
onFinish={() => {console.log("odišiel som")}}/>;

export { Slide3 };