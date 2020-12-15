<?php
	
include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';

class CallbackController extends My_Controller 
{
	
	public function ini()
	{
		
		$post = $this->_request->getPost();
		
		$post['message_id'] = $post['id'];
		$post['mo_type'] = 4;
		$post['err'] = $post['message_status'];
		
		$this->data = new Model_Data(new callback());
		$this->data->_required(array('id_callback','mo_type','submit_date','done_date','smsc_id','dlvrd','message_id','message','source_addr','spid','err','incoming_time','destination_addr','modificado','criado','source_address','stat','mt_message_id'));
		$this->data->_notNull(array(''));
		
		$enviado = $this->data->edit(NULL,$post,NULL,Model_Data::NOVO);
		
		if ($enviado){
			
			echo 'ACK/Jasmin';
			
		} else {
			
			echo 'erro ao inserir.';
			
		}
		
		exit;
		
	}
	    
}