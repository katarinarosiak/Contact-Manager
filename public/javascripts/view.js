/* eslint-disable max-lines-per-function */


class View {
	constructor(serverActions) {
		this.templates = {};
		this.elements = {};  
	}

	init(data) {
		this._compileTemplates();
		this._registerPartialsAndHelpers();
		this._setData(); 
		this.updateView('homePage', {contacts:data}, 'mainContainer');
	}

	addEventHandling(clickHandler, inputHandler, submithandler) {
		document.addEventListener('click', clickHandler);
		document.addEventListener('input', inputHandler);
		document.addEventListener('submit', submithandler); 
	}

	updateView(templateName, data, containerId) {
		let container = document.getElementById(containerId);
		let template = this.templates[templateName];
		container.innerHTML = template(data); 
	}

	makeVisible(elementId){
		let element = document.getElementById(elementId); 
		element.classList.remove('hidden'); 
	}

	makeInvisible(elementId) {
		let element = document.getElementById(elementId); 
		element.classList.add('hidden'); 
	}

	isSearchedByName() {
		let searchOptions = [...document.querySelectorAll('#searchBy input')];
		return searchOptions.filter(option => option.checked)[0].id === 'searchByName'; 
	}

	checkTagsForContact(contact) {
		let tagElements = [...document.querySelectorAll('.tagCheckbox')];

		tagElements.forEach(tag => {
				if (contact.tags.includes(tag.id)) {
						tag.setAttribute('checked', '');
				}
		})
  }

	addTag(addToAvailableTag, findContactById) {
		let inputField = document.querySelector('#newTagInput'); 
		let newTagName = inputField.value.trim();
		
		if (newTagName.length > 0) {
			let avaialbleTags = addToAvailableTag(newTagName);
			if (!avaialbleTags) {
				alert('There is already a tag with that name. Try again.'); 
			} else {
				inputField.value = '';
				let markedTags = this._getMarkedTags(); 
				this.updateView('tags', {tags: avaialbleTags}, 'tagsContainer');
				this._preserveMarkedTags(markedTags);
				this.makeInvisible('newTagFormContainer'); 
				this._markTagsIfEditContact(findContactById);
			}
		} else {
			alert('Tag name has to contain at least one letter. Try again.'); 
		}
	}

	updateSearchedByName(event, searchContactsByName) {
		let filteredContacts = searchContactsByName(event);

		if (filteredContacts.length > 0) {
			this.updateView('contactCards', {contacts:filteredContacts}, 'contactCardsDiv');
		} else {
			this.updateView('noContactsByName', {pattern:event.target.value}, 'contactCardsDiv');
		}
	}

	updateSearchByTag(event, searchContactsByTag) {
		let filteredContacts = searchContactsByTag(event);

		if (filteredContacts.length > 0) {
			this.updateView('contactCards', {contacts:filteredContacts}, 'contactCardsDiv');
		} else {
			this.updateView('noContactsByTag', {pattern:event.target.value}, 'contactCardsDiv');
		}
	}

	_compileTemplates() {
		let templates = [...document.querySelectorAll("[type='text/x-handlebars-template']")];
		templates.forEach(template => {
				let id = template.id; 
				this.templates[id] = Handlebars.compile(template.innerHTML); 
		});
	}

	_registerPartialsAndHelpers() {
		Handlebars.registerPartial('contactPartial', this.templates.contactPartial);
		Handlebars.registerPartial('contactCards', this.templates.contactCards);
		Handlebars.registerPartial('tags', this.templates.tags); 
		Handlebars.registerHelper('makeSpanTags', (tags) => { 
				if (tags.length === 0) return;
				return tags.map(tag => {
						return `<span class="tag">${tag}</span>`
				});
		});

	}

	_setData() {
		this.mainContainer = document.querySelector('#mainTemplateContainer'); 
	}

	_getMarkedTags() {
		return [...document.querySelectorAll('.tagCheckbox')].
		filter(tag => tag.checked).map(tag => tag.id);
	}

	_preserveMarkedTags(markedTags) {
		let allTags = [...document.querySelectorAll('.tagCheckbox')];
		allTags.forEach(tag => {
			if (markedTags.includes(tag.name)) {
				tag.checked = true;
			}
		});
	}

	_markTagsIfEditContact(findContactById) {
			let id = document.querySelector('form').dataset.contactid;

			let contact = findContactById(id);
			if (contact) { 
					this.checkTagsForContact(contact);  
			} 
	}


};

export default View;