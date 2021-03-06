(function() {
	'use strict';

	var duration = 200;



	/**
	 * Tooltips Class
	 */
	var Tooltip = function(reference) {
		var _self = this;

		this.reference = reference;
		this.tooltip   = document.createElement('div');
		this.popper    = null;

		this.options = {
			baseClass: 'c-tooltip',
			position:  'bottom',
			offset:    '0, 7'
		};

		this.state = {
			open: false
		};

		Object.assign(this.options, reference.dataset);

		this.createTooltip = function() {
			if (this.isValidPosition(this.options.tooltipPosition)) {
				this.options.position = this.options.tooltipPosition;
			}

			this.tooltip.id = 'tooltip-' + Math.random().toString(36).substring(6);
			this.tooltip.classList.add(this.options.baseClass);
			this.tooltip.setAttribute('aria-hidden', 'true');
			this.tooltip.innerHTML = this.options.tooltip.trim();

			document.getElementsByTagName('body')[0].appendChild(this.tooltip);

			// Add `aria-describedby` to our reference element for accessibility reasons
			this.reference.setAttribute('aria-describedby', this.tooltip.id);

			this.popper = new Popper(this.reference, this.tooltip, {
				placement: this.options.position,
				modifiers: {
					offset: {
						enabled: true,
						offset: this.options.offset
					}
				},
				eventsEnabled: false
			});
		};

		this.openTooltip = function() {
			this.createTooltip();

			this.tooltip.classList.add('is-open');
			this.tooltip.setAttribute('aria-hidden', 'false');
			this.state.open = true;

			this.popper.scheduleUpdate();
		};

		this.closeTooltip = function() {
			this.tooltip.classList.remove('is-open');
			this.tooltip.classList.add('is-closing');

			setTimeout(function() {
				if (_self.tooltip.parentNode !== null) {
					_self.tooltip.classList.remove('is-closing');
					_self.tooltip.setAttribute('aria-hidden', 'true');
					_self.tooltip.parentNode.removeChild(_self.tooltip);
				}

				_self.state.open = false;
				_self.reference.removeAttribute('aria-describedby');

				if (_self.popper !== null) {
					_self.popper.destroy();
				}
			}, duration);
		};



		/**
		 * Validate the tooltip position
		 */
		this.isValidPosition = function(position) {
			var validPositions = [
				'top',
				'top-start',
				'top-end',
				'bottom',
				'bottom-start',
				'bottom-end',
				'left',
				'left-start',
				'left-end',
				'right',
				'right-start',
				'right-end',
			];

			if (validPositions.indexOf(position) > -1) {
				return true;
			}

			return false;
		};

		this.reference.addEventListener('mouseover', this.openTooltip.bind(_self));
		this.reference.addEventListener('mouseout', this.closeTooltip.bind(_self));
		this.reference.addEventListener('focus', this.openTooltip.bind(_self));
		this.reference.addEventListener('blur', this.closeTooltip.bind(_self));
	};

	// Enable all tooltips
	Array.from(document.querySelectorAll('[data-tooltip]')).forEach(tooltip => {
		new Tooltip(tooltip);
	});



	/**
	 * Modal Class
	 */

	var Modal = function(modal) {
		var _self = this;

		var classes = {};

		Object.assign(classes, modal.dataset);

		this.modal         = modal;
		this.openModalBtn  = document.querySelectorAll('.' + classes.openModal),
		this.closeModalBtn = document.querySelectorAll('.' + classes.closeModal),

		this.state = {
			open: false
		};

		this.createModal = function() {
			var id = 'modal-' + Math.random().toString(36).substring(6);
			var title = this.modal.querySelector('h2');

			if (title) {
				this.modal.setAttribute('aria-labelledby', id);
				title.id = id;
			}
		}

		this.openModal = function() {
			this.modal.classList.add('is-open');
			this.modal.setAttribute('aria-hidden', 'false');
			this.state.open = true;
		};

		this.closeModal = function() {
			this.modal.classList.add('is-closing');
			this.modal.classList.remove('is-open');

			setTimeout(function() {
				_self.modal.classList.remove('is-closing');
				_self.modal.setAttribute('aria-hidden', 'true');
				_self.state.open = false;
			}, duration);
		};

		this.createModal();

		Array.from(_self.openModalBtn).forEach(button => {
			button.addEventListener('click', _self.openModal.bind(_self));
		});

		Array.from(_self.closeModalBtn).forEach(button => {
			button.addEventListener('click', _self.closeModal.bind(_self));
		});

		document.addEventListener('keyup', function(event) {
			// Escape key maps to keycode `27`
			if (event.keyCode == 27) {
				if (_self.state.open) {
					_self.closeModal();
				}
			}
		});
	};

	// Enable all modals
	Array.from(document.querySelectorAll('.js-modal')).forEach(modal => {
		new Modal(modal);
	});



	/**
	 * Dropdown Class
	 */

	var Dropdown = function(btn) {
		var _self = this;

		this.trigger  = btn.previousElementSibling;
		this.dropdown = btn;
		this.popper   = null;
		this.position = 'bottom-start';

		this.state = {
			open: false
		};

		this.createDropdown = function() {
			var id = 'dropdown-' + Math.random().toString(36).substring(6);

			this.trigger.id = id;
			this.trigger.setAttribute('aria-haspopup', true);
			this.trigger.setAttribute('aria-expanded', false);

			this.dropdown.setAttribute('aria-labelledby', id);
		};

		this.toggleDropdown = function() {
			if (_self.state.open) {
				_self.closeDropdown();
			}
			else {
				_self.openDropdown();
			}
		};

		this.openDropdown = function() {
			var options = {};

			Object.assign(options, this.dropdown.dataset);

			if (this.isValidPosition(options.position)) {
				this.position = options.position;
			}

			this.popper = new Popper(this.trigger, this.dropdown, {
				placement: this.position
			});

			this.trigger.classList.add('is-open');
			this.trigger.setAttribute('aria-expanded', true);
			this.dropdown.classList.add('is-open');
			this.state.open = true;
		};

		this.closeDropdown = function() {
			this.trigger.classList.remove('is-open');
			this.trigger.setAttribute('aria-expanded', false);
			this.dropdown.classList.remove('is-open');
			this.state.open = false;

			if (this.popper !== null) {
				this.popper.destroy();
				this.popper = null;
			}
		};



		/**
		 * Validate the dropdown position
		 */
		this.isValidPosition = function(position) {
			var validPositions = [
				'top-start',
				'top-end',
				'bottom-start',
				'bottom-end',
			];

			if (validPositions.indexOf(position) > -1) {
				return true;
			}

			return false;
		};

		this.createDropdown();

		this.trigger.addEventListener('click', function(event) {
			event.stopPropagation();

			_self.toggleDropdown();
		});

		this.dropdown.addEventListener('click', function(event) {
			event.stopPropagation();
		});

		document.addEventListener('click', function(event) {
			_self.closeDropdown();
		});

		document.addEventListener('keyup', function(event) {
			// Escape key maps to keycode `27`
			if (event.keyCode == 27) {
				if (_self.state.open) {
					_self.closeDropdown();
				}
			}
		});
	};

	// Enable all dropdowns
	Array.from(document.querySelectorAll('.c-dropdown')).forEach(button => {
		new Dropdown(button);
	});

}());
