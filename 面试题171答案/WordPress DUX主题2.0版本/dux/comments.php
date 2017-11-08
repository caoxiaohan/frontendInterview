<?php
defined('ABSPATH') or die('This file can not be loaded directly.');

if ( !comments_open() ) return;

/*global $comment_ids; $comment_ids = array();
foreach ( $comments as $comment ) {
	if (get_comment_type() == "comment") {
		$comment_ids[get_comment_id()] = ++$comment_i;
	}
} */


$my_email = get_bloginfo ( 'admin_email' );
$str = "SELECT COUNT(*) FROM $wpdb->comments WHERE comment_post_ID = $post->ID AND comment_approved = '1' AND comment_type = '' AND comment_author_email";
$count_t = $post->comment_count;

date_default_timezone_set('PRC');
$closeTimer = (strtotime(date('Y-m-d G:i:s'))-strtotime(get_the_time('Y-m-d G:i:s')))/86400;
?>
<div class="title" id="comments">
	<h3><?php echo _hui('comment_title') ?> <?php echo $count_t ? '<b>'.$count_t.'</b>':'<small>抢沙发</small>'; ?></h3>
</div>
<div id="respond" class="no_webshot">
	<?php if ( get_option('comment_registration') && !is_user_logged_in() ) { ?>
	<div class="comment-signarea">
		<h3 class="text-muted">评论前必须登录！</h3>
		<p>
			<a href="javascript:;" class="btn btn-primary signin-loader">立即登录</a> &nbsp; 
			<a href="javascript:;" class="btn btn-default signup-loader">注册</a>
		</p>
	</div>
	<?php }elseif( get_option('close_comments_for_old_posts') && $closeTimer > get_option('close_comments_days_old') ) { ?>
	<h3 class="title">
		<strong>文章评论已关闭！</strong>
	</h3>
	<?php }else{ ?>
	
	<form action="<?php echo get_option('siteurl'); ?>/wp-comments-post.php" method="post" id="commentform">
		<div class="comt">
			<div class="comt-title">
				<?php 
					if ( is_user_logged_in() ) {
						global $current_user;
						// get_currentuserinfo();
						echo _get_the_avatar($user_id=get_current_user_id(), $user_email=$current_user->user_email);
						echo '<p>'.$user_identity.'</p>';
					}
					else{
						if( $comment_author_email!=='' ) {
							echo _get_the_avatar($user_id='', $user_email=$comment->comment_author_email);
						}
						else{
							echo _get_the_avatar($user_id='', $user_email='');
						}
						if ( !empty($comment_author) ){
							echo '<p>'.$comment_author.'</p>';
							echo '<p><a href="javascript:;" evt="comment-user-change">更换</a></p>';
						}
					}
				?>
				<p><a id="cancel-comment-reply-link" href="javascript:;">取消</a></p>
			</div>
			<div class="comt-box">
				<textarea placeholder="<?php echo _hui('comment_text') ?>" class="input-block-level comt-area" name="comment" id="comment" cols="100%" rows="3" tabindex="1" onkeydown="if(event.ctrlKey&amp;&amp;event.keyCode==13){document.getElementById('submit').click();return false};"></textarea>
				<div class="comt-ctrl">
					<div class="comt-tips"><?php comment_id_fields(); do_action('comment_form', $post->ID); ?></div>
					<button type="submit" name="submit" id="submit" tabindex="5"><?php echo _hui('comment_submit_text') ? _hui('comment_submit_text') : '提交评论' ?></button>
					<!-- <span data-type="comment-insert-smilie" class="muted comt-smilie"><i class="icon-thumbs-up icon12"></i> 表情</span> -->
				</div>
			</div>

			<?php if ( !is_user_logged_in() ) { ?>
				<?php if( get_option('require_name_email') ){ ?>
					<div class="comt-comterinfo" id="comment-author-info" <?php if ( !empty($comment_author) ) echo 'style="display:none"'; ?>>
						<ul>
							<li class="form-inline"><label class="hide" for="author">昵称</label><input class="ipt" type="text" name="author" id="author" value="<?php echo esc_attr($comment_author); ?>" tabindex="2" placeholder="昵称"><span class="text-muted">昵称 (必填)</span></li>
							<li class="form-inline"><label class="hide" for="email">邮箱</label><input class="ipt" type="text" name="email" id="email" value="<?php echo esc_attr($comment_author_email); ?>" tabindex="3" placeholder="邮箱"><span class="text-muted">邮箱 (必填)</span></li>
							<li class="form-inline"><label class="hide" for="url">网址</label><input class="ipt" type="text" name="url" id="url" value="<?php echo esc_attr($comment_author_url); ?>" tabindex="4" placeholder="网址"><span class="text-muted">网址</span></li>
						</ul>
					</div>
				<?php } ?>
			<?php } ?>
		</div>

	</form>
	<?php } ?>
</div>
<?php  

if ( have_comments() ) { 
?>
<div id="postcomments">
	<ol class="commentlist">
		<?php 
		_moloader('mo_comments_list', false);
		wp_list_comments('type=comment&callback=mo_comments_list');
		?>
	</ol>
	<div class="pagenav">
		<?php paginate_comments_links('prev_next=0');?>
	</div>
</div>
<?php 
} 
?>