import { createStore, combineReducers } from 'redux'
import { applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import userReducers from '../reducers/usersReducers'
import tasksReducers from '../reducers/tasksReducers'

const configureStore = () => {
    const store = createStore(combineReducers({
     
        users :userReducers,
        tasks:tasksReducers
        
    }), applyMiddleware(thunk))
    return store
}

export default configureStore