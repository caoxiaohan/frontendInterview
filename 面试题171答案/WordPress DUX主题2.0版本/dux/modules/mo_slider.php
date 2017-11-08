<?php
/**
 * [mo_slider description]
 * @param  string $id   [description]
 * @return html         [description]
 */
function mo_slider( $id='slider' ){
	$indicators = '';
	$inner = '';

	$sort = _hui($id.'_sort') ? _hui($id.'_sort') : '1 2 3 4 5';
    $sort = array_unique(explode(' ', trim($sort)));
    $i = 0;
    foreach ($sort as $key => $value) {
        if( _hui($id.'_src_'.$value) && _hui($id.'_href_'.$value) && _hui($id.'_title_'.$value) ){
            $indicators .= '<li data-target="#'.$id.'" data-slide-to="'.$i.'"'.(!$i?' class="active"':'').'></li>';
            $inner .= '<div class="item'.(!$i?' active':'').'"><a'.( _hui($id.'_blank_'.$value) ? ' target="_blank"' : '' ).' href="'._hui($id.'_href_'.$value).'"><img src="'._hui($id.'_src_'.$value).'"></a></div>';
            // <span class="carousel-caption">'._hui($id.'_title_'.$value).'</span>
            $i++;
        }
    }

	echo '<div id="'.$id.'" class="carousel slide" data-ride="carousel"><ol class="carousel-indicators">'.$indicators.'</ol><div class="carousel-inner" role="listbox">'.$inner.'</div><a class="left carousel-control" href="#'.$id.'" role="button" data-slide="prev"><i class="fa fa-angle-left"></i></a><a class="right carousel-control" href="#'.$id.'" role="button" data-slide="next"><i class="fa fa-angle-right"></i></a></div>';
}