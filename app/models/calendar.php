<?php
class gcalendar{
	private $cal_id;
	//To get credentials follow this steps ==> http://cornempire.net/2012/01/08/part-2-oauth2-and-configuring-your-application-with-google/
	private $client_secret='sKWMWvX8Q28-rFZ-qE5CCTyz';//TO CHANGE
	private $refresh_token='https://accounts.google.com/o/oauth2/token';//TO CHANGE
	private $client_id='549356902835-s0m7iddkud5cgmib15pad9eg4h2n9di0.apps.googleusercontent.com';//TO CHANGE
	public  $spindle='+01:00';
	private $token;

	public function __construct($cal_id){
		$this->token=$this->get_access_token();
		$this->cal_id=$cal_id;
	}

	
	//Retourne un token
	private function get_access_token(){
		$tokenURL = 'https://accounts.google.com/o/oauth2/token';
		$postData = array(
				'client_secret'=>$this->client_secret,
				'grant_type'=>'refresh_token',
				'refresh_token'=>$this->refresh_token,
				'client_id'=>$this->client_id
		);
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $tokenURL);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

		$tokenReturn = curl_exec($ch);
		$token = json_decode($tokenReturn);

		$accessToken = $token->access_token;
		return $accessToken;
	}

	//liste tous les events sur la période définit en param
	public function list_events($start_date,$end_date){
		return $this->execute('list_events',false,array('start_date'=>$start_date,'end_date'=>$end_date));
	}

	//Récupere l'event ayant l'id passer en param
	public function get_event($event_id){
		return $this->execute('get_event',false,array('event_id'=>$event_id));
	}

	//Ajoute un event !!Attention$_data doit respecter une certaine syntaxe voir plus bas fonction create_args!
	public function add_event($_data){
		$args=$this->create_args($_data);
		return($this->execute('add_event',$args));
	}

	//Modifie un rdv (heures, titre ou contenu).
	public function update_event($event_id,$_data){
		$ev=json_decode($this->get_event($event_id));
		$_data['sequence']=$ev->sequence+1;
		$args=$this->create_args($_data);
		return($this->execute('update_event',$args,array('event_id'=>$event_id)));
	}

	//Supprime un event
	public function delete_event($event_id){
		return $this->execute('delete_event',false,array('event_id'=>$event_id));
	}

	/*
	 **  $_data=array(
	 		!start_date =>  Date de début de l'event au format Y-m-d
	 		!start_time =>  Heure de début de l'event au format HH:ii
	 		!end_date   =>  Date de fin de l'event Y-m-d
	 		!end_time   =>  Heure de fin de l'event HH:ii
	 		summary     =>  Titre de l'event (title)
	 		description =>  Description de l'event
	 		sequence    =>  Sequence de l'event (C'est un numéro à incrémenter à chaque update de l'event). Obligatoire lors d'un update.
	 )
	Les champs avec un ! sont obligatoires!
	**
	*/
	private function create_args($_data){
		$_args=array(   'start'     =>  array('dateTime'=>$_data['start_date']."T".$_data['start_time'].":00.000".$this->spindle),
				'end'       =>  array('dateTime'=>$_data['end_date']."T".$_data['end_time'].":00.000".$this->spindle));
		unset($_data['start_date']);
		unset($_data['start_time']);
		unset($_data['end_date']);
		unset($_data['end_time']);
		foreach($_data as $key=>$value){
			$_args[$key]=$value;
		}
		return json_encode($_args);
	}

	//execute les requetes curl adaptée selon le type ($type_exe)
	private function execute($type_exe,$args=false,$opt=false){
		switch ($type_exe){
			case 'list_events':
				$request='https://www.googleapis.com/calendar/v3/calendars/'.urlencode($this->cal_id).'/events?timeMax='.urlencode($opt['end_date'].'T23:59:59.000'.$this->spindle).'&timeMin='.urlencode($opt['start_date'].'T00:00:01.000'.$this->spindle);
				$session = curl_init($request);
				break;
			case 'get_event':
				$request='https://www.googleapis.com/calendar/v3/calendars/'.urlencode($this->cal_id).'/events/'.$opt['event_id'];
				$session = curl_init($request);
				break;
			case 'add_event':
				$request='https://www.googleapis.com/calendar/v3/calendars/'.urlencode($this->cal_id).'/events';
				$session = curl_init($request);
				curl_setopt ($session, CURLOPT_POST, true);
				break;
			case 'update_event':
				$request =  'https://www.googleapis.com/calendar/v3/calendars/'.urlencode($this->cal_id).'/events/'.$opt['event_id'];
				$session = curl_init($request);
				curl_setopt($session, CURLOPT_CUSTOMREQUEST, "PUT");
				break;
			case 'delete_event':
				$request='https://www.googleapis.com/calendar/v3/calendars/'.urlencode($this->cal_id).'/events/'.$opt['event_id'];
				$session = curl_init($request);
				curl_setopt($session, CURLOPT_CUSTOMREQUEST, "DELETE");
				break;
		}
		if($args){
			curl_setopt ($session, CURLOPT_POSTFIELDS, $args);
		}
		curl_setopt($session, CURLOPT_HEADER, false);
		curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($session, CURLOPT_VERBOSE, true);
		curl_setopt($session, CURLINFO_HEADER_OUT, true);
		curl_setopt($session, CURLOPT_HTTPHEADER, array('Content-Type:  application/json','Authorization:  Bearer ' . $this->token,'X-JavaScript-User-Agent:  My_company'));
		$response = curl_exec($session);
		curl_close($session);
		return $response;
	}
}