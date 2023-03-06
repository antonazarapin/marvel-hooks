import { Formik, Form, Field, ErrorMessage as FormikErrorMessage} from 'formik';
import * as Yup from "yup"
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import useMarverService from '../../services/MarverService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './findCharacter.scss';

const FindCharacter = () => {
    const [char, setChar] = useState(null);

    const {loading, error, clearError, getCharacterByNameStartWith} = useMarverService();

    const onCharLoaded = (char) => {
        setChar(char)
    }

    const updateChar = (name) => {
        clearError();

        getCharacterByNameStartWith(name)
            .then(onCharLoaded)
    }

    const renderItems = (arr) => {
        const items = arr.map((item, i) => {
            return (
                <CSSTransition
                    key={i}
                    timeout={800}
                    classNames="find__character_item">

                    <li className="find__character_item">
                        <Link to={`/characters/${item.id}`} className="find__character_item">
                            <div className="find__character_item-name">{item.name}</div>
                        </Link>
                    </li>
                </CSSTransition>
            )
        })
    
        return (
            <ul className="find__character_items">
                <TransitionGroup component={null}>
                    {items}
                </TransitionGroup>
            </ul>
        )
    }

    const results = !char ? null : char.length > 0 ? renderItems(char) : (
        <div className='find__character_error'>The character was not found. Check the name and try again</div>
    )

    const errorMessage = error ? <div className='find__character_critical_error'><ErrorMessage/></div> : null;
    
    return (
        <Formik
            initialValues={{
                name: ''
            }}
            validationSchema={Yup.object({
                name: Yup.string()
                            .min(2, 'Minimum 2 characters')
                            .required('*Required field')
                            .matches(/^[a-zA-Z0-9 ]+$/, 'Name must contain only latin letters')
            })}
            onSubmit = {({name}) => {updateChar(name)}}>

            <Form className='find__character'>
                <h2 className='find__character_title'>Find a character by name:</h2>
                <div className='find__character_form'>

                    <div className='find__character_in'>
                        <Field 
                            name="name"
                            id="name"
                            placeholder="Enter name"
                            type="text"
                            className="find__character_input" />

                        <button 
                            type='submit' 
                            className="button button__main"
                            disabled={loading}>
                            <div className='inner'>Find</div>
                        </button>
                    </div>

                    <FormikErrorMessage name="name" className="find__character_error" component="div"/>

                    {results}
                    {errorMessage}
                </div>
            </Form>
        </Formik>
    )
}

export default FindCharacter;