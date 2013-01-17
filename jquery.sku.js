(function ($) {
	var $container;
	var availability;
	var $sections;
	
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
			
			//handle possible case where sku is preselected server-side
			methods.refresh();
			
			$sections.find('input[type=radio]').change(function() {
				methods.refresh();
				
				var label = $(this).parents('label');
				label.addClass('selected').siblings().removeClass('selected');
			});
			
			$sections.find('label').hover(function() {
				$(this).addClass('is-hovered');
				methods.refresh();
			}, function() {
				$(this).removeClass('is-hovered');
				methods.refresh();
			});
		},
		refresh: function() {
			resetUnavail();
			
			var doCheckCanBuy = true;
			var currentSku = '';
			
			$sections.each(function() {
				var $section = $(this);
				
				var $input = null;
				var skuID = null;
				var skuText = null;
				
				//check hover first; if nothing hovered, then check checked
				var $hovered = $section.find('.is-hovered')
				if ($hovered.length)
					$input = $hovered.find('input');
				else
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
			});
			
			if (doCheckCanBuy)
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

