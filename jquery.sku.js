(function ($) {
	var IEHAX = $('.lt-ie9').length;
	var availability, sizeText;
	
	var $container;
	var $sections;
	
	var $btnAddToCart, $btnNotAvail, $speedbuy;
	
	var checkUnavail = function($section, skuID) {
		$section.find('input').each(function(){
			$this = $(this);
			$label = $this.parents('label');
			var val = $this.val();
			var avail = availability[skuID + val] || availability[val + skuID] || null;
			
			if (avail && avail == 'I')
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
			sizeText = this.find('[data-sizes]').data('sizes');
			
			$sections = this.find('.sku-buttons');
			
			$btnAddToCart = this.find('.cta-checkout .btn-primary');
			$btnNotAvail = this.find('.cta-checkout .btn-danger.disabled');
			$speedbuy = this.find('.cta-checkout .speedbuy');
			
			//hack to fix issue where IE8 and below has a problem where
			//clicking an <img> in a <label> doesn't trigger the form element
			//modified from http://snook.ca/archives/javascript/using_images_as
			if (IEHAX) //IE8 and below hax
			{
				$sections.find('label img').click(function(){
					$(this).siblings('input').click();
				});
			}
			
			//handle possible case where sku is preselected server-side
			methods.refresh(true);
			
			$sections.find('input[type=radio]').change(function() {
				var $this = $(this);
				if (IEHAX)
					$this.prop('checked', 'checked');
				
				methods.refresh(true, $this);
				
				var label = $this.parents('label');
				label.addClass('selected').siblings().removeClass('selected');
			});
			
			$sections.find('label').hover(function() {
				var $this = $(this);
				$this.addClass('is-hovered');
				methods.refresh(false, $this);
			}, function() {
				var $this = $(this);
				$this.removeClass('is-hovered');
				methods.refresh(false, $this);
			});
		},
		refresh: function(ignoreHover, $this) {
			resetUnavail();
			
			var doCheckCanBuy = $sections.length > 0;
			var currentSku = '';
			var isColorSection = $this && $this.parents('.sku-options').length;
			
			$sections.each(function() {
				var $section = $(this);
				
				var $input = null;
				var skuID = null;
				var skuText = '';
				
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
					skuID = $input.val();
					skuText = sizeText[skuID];
					currentSku = skuID + currentSku;
					checkUnavail($section.siblings('.sku-buttons'), skuID);
				}
				else //when nothing selected or hovered
				{
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
					$speedbuy.show();
					$btnNotAvail.hide();
				}
				else
				{
					$btnAddToCart.hide();
					$speedbuy.hide();
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
