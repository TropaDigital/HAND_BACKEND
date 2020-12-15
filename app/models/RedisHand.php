<?php
require_once 'app/models/predis/autoload.php';

class redisHand {
    
    //configs redis campanhas
    const redis_ip_campanha = '172.17.33.3';
    const redis_porta_campanha = 6379;
    const redis_senha_campanha = 'babba672b8ddbb0f65dbb881c503dfda6548615c9f580d17e99883d18fe1aa45';
    
    //configs redis campanhas
    const redis_ip_sms = '172.17.33.3';
    const redis_porta_sms = 6379;
    const redis_senha_sms = 'babba672b8ddbb0f65dbb881c503dfda6548615c9f580d17e99883d18fe1aa45';
    
    const redis_ip_whitelabel = '172.17.33.3';
    const redis_porta_whitelabel = 6379;
    const redis_senha_whitelabel = 'babba672b8ddbb0f65dbb881c503dfda6548615c9f580d17e99883d18fe1aa45';
    
    private $redis_campanha = NULL;
    private $redis_sms = NULL;
    
    public function __construct()
    {
        
        $redis = new Predis\Client([
            'scheme' => 'tcp',
            'host'   => $this::redis_ip_campanha,
            'port'   => $this::redis_porta_campanha,
            'database'=>'0',
//             'password'=>$this::redis_senha_campanha
        ]);
//         $redis->auth($this::redis_senha_campanha);
        
        //declara o redis da campanha
        $this->redis_campanha = $redis;
        
        $redis = new Predis\Client([
            'scheme' => 'tcp',
            'host'   => $this::redis_ip_sms,
            'port'   => $this::redis_porta_sms,
            'database'=>'1',
//             'password'=>$this::redis_senha_sms
        ]);
//         $redis->auth($this::redis_senha_sms);
        
        //declara o redis do sms
        $this->redis_sms = $redis;
        
    }
    
    public function SetCampanha ( $params )
    {
        
        $dados = current( $params );
        $totalLotes = count( $params );
        
        //total de sms
        $total = 0;
        foreach ( $params as $row )
        {
            
            $total = $total + $row['qtdade'];
            
        }
        
        $campanha = [];
        $campanha['idCampanha'] = $dados['id_campanha'];
        
        //lotes
        $campanha['idLotes'] = [];
        
        for($i = 0; $i < $totalLotes; $i++){
        
            $campanha['idLotes'][] = $i;
            
        }
        
        $campanha['idLotes'] = json_encode( $campanha['idLotes'] );
        $campanha['status'] = 0;
        $campanha['send_method'] = 'pb';
        $campanha['usuario'] = $dados['login_envio'];
//         $campanha['usuario'] = $dados['json_sms']['sms']['username_sms'];
        $campanha['qtd_total'] = $total;
        $campanha['enviados'] = 0;
        $campanha['group'] = $dados['json_sms']['gid'];
        $campanha['password'] = $dados['senha_envio'];
//         $campanha['password'] = $dados['json_sms']['sms']['password_sms'];
        
        $set = $this->redis_campanha->hmset($dados['id_campanha'], $campanha );
        
        $result = [];
        $result['campanha'] = $set;
        $result['lotes'] = [];
        
        if ( $set ) {
            
            $i=0;
            foreach ( $params as $row )
            {
                
                $row['data_f'] = $row['data_i'] == $row['data_f'] ? 'None' : $row['data_f'];
                
                if ( $row['data_f'] != 'None' ) {
                    $row['data_f'] = date('d/m/Y H:i', strtotime($row['data_f']));
                }
                $row['data_i'] = date('d/m/Y H:i', strtotime($row['data_i']));
                
                $campanha = [];
                $campanha['idLote'] = $i;
                $campanha['status'] = 0;
                $campanha['escala'] = 10;
                $campanha['data_ini'] = $row['data_i'];
                $campanha['data_fim'] = $row['data_f'];
                $campanha['pos_ini'] = 0;
                $campanha['pos_fim'] = $row['qtdade'] - 1;
                $campanha['pos'] = 0;
                $campanha['qtd_sms'] = $row['qtdade'];
                $set = $this->redis_campanha->hmset($dados['id_campanha'].':'.$i, $campanha );
                
                $result['lotes'][$i] = $set;
                
                $i++;
                
                $result['lotes'][$i]['lote'] = $campanha;
                $result['lotes'][$i]['set'] = $set;
                
            }
            
        }
        
        return $result;
        
    }
    
    public function LoadCampanha( $data )
    {
        
        $data = json_encode($data);
        
        $set = $this->redis_campanha->lpush( 'load', $data );
        
        return ['data'=>$data, 'set'=>$set];
        
    }
    
    public function setSMS( $id_campanha, $sms )
    {
        
        $set = $this->redis_sms->lpush($id_campanha, $sms);
        
        return count($set);
        
    }
    
}