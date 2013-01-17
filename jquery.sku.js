(function ($) {
	var container;
	var availability;
	var sections;
	
	var methods = {
		init: function() {
			container = this;
			availability = this.data('skuAvailability');
			sections = this.find('.sku-buttons');
			
			//handle possible case where sku is preselected server-side
			methods.refresh();
			
			sections.find('input[type=radio]').change(function() {
				methods.refresh();
				
				var label = $(this).parents('label');
				label.addClass('selected').siblings().removeClass('selected');
			});
		},
		refresh: function() {
			var doCheckAvail = true;
			var currentSku = '';
			
			sections.each(function() {
				var $section = $(this);
				var $checked = $section.find(':checked');
				
				if ($checked.length)
				{
					$section.find('.current-choice').text($checked.data('skuText'));
					
					currentSku = $checked.val() + currentSku;
				}
				else //when this section does not have an option selected
					doCheckAvail = false;
			});
			
			if (doCheckAvail)
			{
				if (availability[currentSku])
				{
					console.log('AVAILABLE: ' + currentSku);
				}
				else
				{
					console.log('NOT AVAILABLE: ' + currentSku);
				}
			}
		}
	};
	
	$.fn.sku = function(method) {
		if (methods[method])
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		else if (typeof method === 'object' || !method)
			return methods.init.apply(this, arguments);
		else
			$.error('Method ' +  method + ' does not exist on jQuery.fn.sku');
	};
})(jQuery);
