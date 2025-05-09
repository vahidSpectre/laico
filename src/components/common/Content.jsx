import React from 'react';

import classes from './Content.module.css';
const Content = ({ children, sectionClassname, contentClassname }) => {
 return (
  <section className={`${classes.main} ${sectionClassname}`}>
   <div className={`${classes.content} ${contentClassname}`}>
    {children}
   </div>
  </section>
 );
};

export default Content;
