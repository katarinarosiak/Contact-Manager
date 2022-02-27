/* eslint-disable max-lines-per-function */
import Model from "./model.js";
import View from "./view.js";



class Controller{
	constructor(view, model) {
		this.view = new View();
		this.model = new Model();
	}

	init() {
		this.model.getContacts(this.view.init.bind(this.view));
		this.view.addEventHandling(
			this.clickDispatcher.bind(this), 
			this.inputDispatcher.bind(this), 
			this.submitDispatcher.bind(this)
		);
	}

	clickDispatcher(event) { 
		let action = event.target.dataset.action;
		if (action) {			
			this[action](event) 
		} 
	}

	inputDispatcher(event) {
		let action = event.target.dataset.action;
		if (action) {			
			this[action](event) 
		} 
	}

	submitDispatcher(event) {
		event.preventDefault(); 
		let submitaction = event.target.dataset.submitaction;
		if (submitaction) {			
			this[submitaction](event) 
		} 
	}

	displayNewContactForm() {
		let data = {tags: this.model.availableTags}; 
		this.view.updateView('formTemplate', data, 'mainContainer'); 
	}

	displayEditContactForm(event) {
		let id = event.target.parentNode.id;
		let contact = this.model.findContactById(id);
		let data = {
			tags: this.model.availableTags,
			contact: contact
		};

		this.view.updateView('formTemplate', data, 'mainContainer');
		this.view.checkTagsForContact(contact); 
	}

	cancelAddingTag() {
		this.view.makeInvisible('newTagFormContainer'); 
	}

	cancelForm() {
		this.view.updateView('homePage', {contacts: this.model.contactsData}, 'mainContainer'); 
	}

	removeContact(event) {
		let id = event.target.parentNode.id;
		let answer = confirm('Do you want to delete this contact?');

		if (answer) {
			this.model.deleteContact(id, () => {
					this.model.getContacts((data) => {
							this.view.updateView('homePage', {contacts:data}, 'mainContainer');
					})
			})
		}
	}

	confirmCreateTag(event) {
		this.view.addTag( 
			this.model.addToAvaialableTags.bind(this.model),
			this.model.findContactById.bind(this.model)
			);
	}

	createNewtag() {
		this.view.makeVisible('newTagFormContainer'); 
	}

	submitNewContact(event) {
		event.preventDefault(); 
		let form = event.target.closest('form');
		this.model.submitFormData(form, (data) => {
			this.view.updateView('homePage', {contacts:data}, 'mainContainer');
		});
	}

	submitEditedContact(event) {
		event.preventDefault();
		let form = event.target.closest('form');
		let contactId = form.dataset.contactid;
		this.model.submitFormData(form, (data) => {
			this.view.updateView('homePage', {contacts:data}, 'mainContainer');
		}, contactId); 
	}

	search(event) {
		if (event.target.value === '') {
			this.view.updateView('contactCards', {contacts:this.model.contactsData}, 'contactCardsDiv');
			return;
		}

		if (this.view.isSearchedByName()) {
			this.view.updateSearchedByName(event, this.model.searchContactsByName.bind(this.model)); 
		} else {
			this.view.updateSearchByTag(event, this.model.searchContactsByTag.bind(this.model));
		}
	}

}


export default Controller;