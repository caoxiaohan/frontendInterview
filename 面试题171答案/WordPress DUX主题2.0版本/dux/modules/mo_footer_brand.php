<div class="branding branding-black">
	<div class="container">
		<h2><?php echo _hui('footer_brand_title') ?></h2>
		<?php  
			for ($i=1; $i <= 2; $i++) { 
				if( _hui('footer_brand_btn_text_'.$i) && _hui('footer_brand_btn_href_'.$i) ){
					echo '<a'.(_hui('footer_brand_btn_blank_'.$i)?' target="blank"':'').' class="btn btn-lg" href="'._hui('footer_brand_btn_href_'.$i).'">'._hui('footer_brand_btn_text_'.$i).'</a>';
				}
			}
		?>
	</div>
</div>