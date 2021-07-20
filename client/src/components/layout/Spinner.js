import React, {Fragemnt} from 'react';
import spinner from './spinner.gif';

export default () => (
    <Fragemnt>
        <img
        src ={spinner}
        style= {{width: '200px', margin: 'auto', display: 'block'}}
        alt='Loading...'
        />

    </Fragemnt>
);
