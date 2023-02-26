import expressLoader from './express';
import databaseLoader from './database';

export default ({app}) => {
  try{
    databaseLoader();
    expressLoader({app});
  }catch(error){
    throw error;
  }
}