import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import { Report } from 'notiflix/build/notiflix-report-aio';

import ContactList from './ContactList';
import Filter from './Filter';
import ContactForm from './ContactForm';

import css from './App.module.css';
import Message from './Message';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  addContact = ({ name, number }) => {
    const { contacts } = this.state;
    const newContact = { id: nanoid(), name, number };

    contacts.some(contact => contact.name === name)
      ? Report.warning(
          `${name}`,
          'This user is already in the contact list.',
          'OK'
        )
      : this.setState(({ contacts }) => ({
          contacts: [newContact, ...contacts],
        }));
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  filtredContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(normalizedFilter)
    );
  };

  componentDidMount() {
    const stringifiedContacts = localStorage.getItem('contacts');
    const contacts = JSON.parse(stringifiedContacts) ?? [];
    this.setState({ contacts });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts.length !== this.state.contacts.length) {
      const stringifiedContacts = JSON.stringify(this.state.contacts);
      localStorage.setItem('contacts', stringifiedContacts);
    }
  }

  render() {
    const { filter } = this.state;
    const addContact = this.addContact;
    const deleteContact = this.deleteContact;
    const changeFilter = this.changeFilter;
    const filtredContacts = this.filtredContacts();

    return (
      <div className={css.container}>
        <h1 className={css.title}>
          Phone<span className={css.title__color}>book</span>
        </h1>
        <ContactForm onSubmit={addContact} />
        <h2 className={css.subtitle}>Contacts</h2>
        <Filter filter={filter} changeFilter={changeFilter} />
        {this.state.contacts.length > 0 ? (
          <ContactList
            contacts={filtredContacts}
            onDeleteContact={deleteContact}
          />
        ) : (
          <Message text="Contact list is empty." />
        )}
      </div>
    );
  }
}
