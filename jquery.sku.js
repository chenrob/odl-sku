(function ($) {
	var availability;
	
	var $container;
	var $sections;
	
	var $btnAddToCart;
	var $btnNotAvail;
	
	var checkUnavail = function($section, skuID) {
		$section.find('input').each(function(){
			$this = $(this);
			$label = $this.parents('label');
			var val = $this.val();
			
			if (availability[skuID + val] || availability[val + skuID])
			{
				$label.removeClass('unavailable');
			}
			else
			{
				$label.addClass('unavailable');
			}
		});
	};
	
	var resetUnavail = function() { $sections.find('.unavailable').removeClass('unavailable'); }
	
	var methods = {
		init: function() {
			$container = this;
			availability = this.data('skuAvailability');
			$sections = this.find('.sku-buttons');
			
			$btnAddToCart = this.find('.cta-checkout .btn-primary');
			$btnNotAvail = this.find('.cta-checkout .btn-danger.disabled');
			
			//hack to fix issue where IE8 and below has a problem where
			//clicking an <img> in a <label> doesn't trigger the form element
			//modified from http://snook.ca/archives/javascript/using_images_as
			if ($('.lt-ie9').length)
			{
				$sections.find('label img').click(function(){
					$(this).parents('label').find('input').click();
				});
			}
			
			//handle possible case where sku is preselected server-side
			methods.refresh(true);
			
			$sections.find('input[type=radio]').change(function() {
				methods.refresh(true);
				
				var label = $(this).parents('label');
				label.addClass('selected').siblings().removeClass('selected');
			});
			
			$sections.find('label').hover(function() {
				$(this).addClass('is-hovered');
				methods.refresh(false);
			}, function() {
				$(this).removeClass('is-hovered');
				methods.refresh(false);
			});
		},
		refresh: function(ignoreHover) {
			resetUnavail();
			
			var doCheckCanBuy = true;
			var currentSku = '';
			
			$sections.each(function() {
				var $section = $(this);
				var isColorSection = $section.hasClass('sku-options');
				
				var $input = null;
				var skuID = null;
				var skuText = null;
				
				//check hover first; if nothing hovered, then check checked
				if (!ignoreHover)
				{
					var $hovered = $section.find('.is-hovered')
					if ($hovered.length)
					{
						$input = $hovered.find('input');
						doCheckCanBuy = false; //too jarring to change the cta buttons on hover
					}
				}
				
				if (!$input)
				{
					var $checked = $section.find(':checked');
					if ($checked.length)
						$input = $checked;
				}
				
				if ($input)
				{
					skuText = $input.data('skuText');
					skuID = $input.val();
				}
				
				if (skuID)
				{
					currentSku = skuID + currentSku;
					checkUnavail($section.siblings('.sku-buttons'), skuID);
				}
				else //when nothing selected or hovered
				{
					skuText = '';
					doCheckCanBuy = false;
				}
				
				$section.find('.current-choice').text(skuText);
				$(window).trigger('refresh.sku.' + (isColorSection ? 'color' : 'size'), [skuID, skuText]);
			});
			
			if (doCheckCanBuy)
			{
				if (availability[currentSku])
				{
					$btnAddToCart.show();
					$btnNotAvail.hide();
				}
				else
				{
					$btnAddToCart.hide();
					$btnNotAvail.show();
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

