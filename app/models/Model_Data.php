<?php

/**
 * Zend_Model_Data
 * 
 * Model usado para tratar os registros usados nos formulários. 
 * Com possibilidade para exibir, editar e excluir registros selecionados.
 *  
 * @author fabio@novaeradesign.com.br
 * @version BETA 1 
 */

require_once 'Zend/Db/Table/Abstract.php';
require_once 'Zend/Db/Select.php';
require_once 'app/models/File/Upload.php';

class Model_Data
{
	/**
	 * ### CONSTANTES
	 */

	/**
	 * Atualiza o registro existente
	 */
	const ATUALIZA = 1;
	
	/**
	 * Insere como novo
	 */
	const NOVO = 3;
	
    /**
     * Instanceof Zend_Db_Table
     *
     * @var Zend_Db_Table
     */
	protected $table;
	
	/**
	 * array de valores
	 *
	 * @var array
	 */
	protected $data;
	
	/**
	 * número inteiro
	 *
	 * @var integer
	 */
	protected $id;

	/**
	 * chave primária
	 *
	 * @var string
	 */
	protected $primary;
		
	/**
	 * Objeto de resposta
	 *
	 * @var object
	 */
	protected $result;
	
	/**
	 * Contém os dados de resposta do registro atual (a ser editado)
	 *
	 * @var object
	 */
	protected $current;
	
	/**
	 * arquivos que serão substituidos na hora de atualizar o registro
	 *
	 * @var array
	 */
	protected $beReplaced = array();
	
	/**
	 * Campos existentes
	 *
	 * @var array
	 */
	protected $required = array();
	
	/**
	 * Campos necessários
	 *
	 * @var array
	 */
	protected $notNull = array();
	
	/**
	 * opções para os campos postados
	 *
	 * @var array
	 */
	protected $options = array();
	
	/**
	 * Valores a serem procurados
	 *
	 * @var array
	 */
	protected $matchPattern = array("{--}","{;}","{\'}","{\"}","{'}");
	
	/**
	 * Valores a serem substituidos
	 *
	 * @var unknown_type
	 */
	protected $matchReplace = array();
	
	protected $erro = 'true';
	
	/**
	 * Metodo construtor
	 *
	 * @param mixed $table
	 * @param array $data
	 * @param int $id
	 * @param array $required
	 * @param array $notNull
	 * @return bool
	 */
	public function __construct ($table,array $data=NULL,$id=NULL,$required=array(),$notNull=array())
	{
		if ( $table instanceof Zend_Db_Table_Abstract || $table instanceof Zend_Db_Select )
			$this->table = $table;
		else
			throw new Exception('Erro na Tabela');
		
		if ( sizeof($data) )
			$this->data = $data;
			
		if ( NULL !== $id )
			$this->id = $id;
			
		if ( sizeof($required) )
			$this->required = $required;
			
		if ( sizeof($notNull) )
			$this->notNull = $notNull;
	}
	
	/**
	 * Seleciona os registro com base no $where e na ordenação $order
	 * para poder listar na página inicial (ou outra qualquer).
	 *
	 * @param mixed $columns
	 * @param int|string $where
	 * @param string|array|Zend_Db_Select $order
	 * @return object
	 */
	public function select ($columns="*",$where=NULL,$order=NULL)
	{
		if ( !empty($columns) )
		{
			if ( is_numeric($where) )
				$row = $this->table->find($where);
			else
				$row = $this->table->fetchAll($where,$order);
			
			$result = new stdClass();
			
			if ( $row->count() > 0 )
			{
				$result->list = $row;
			} else
			{
				$result->noResults = 'Nenhum registro cadastrado';
			}
		} else
		{
			throw new Exception('Coluna');
		}
		
		return $result;
	}
	
	/**
	 * Lista os campos para edição e seleciona o metodo de tratamento no banco de dados (novo/atualiza)
	 * pode ser usado o critério $where ou o $id
	 *
	 * @param integer $id
	 * @param array $data
	 * @param string $where
	 * @param integer $opt
	 * @return SELF::_salva()
	 */
	public function edit ($id=NULL,$data=NULL,$where=NULL,$opt=NULL)
	{
		if ( NULL !== $id )
			$this->current = $row = $this->table->find($id);
		
		if ( NULL === $data )
		{	
			if ( $row )
				return $row->current();
			else 
				return false;
		} else
		{
			if ( NULL === $opt )
			{
				if ( NULL !== $data['opt'] )
					$opt = $data['opt'];
				else 
					return false;//echo 'Marque se é para salvar ou inserir um novo';
			}

			if ( NULL === $where && $opt == self::ATUALIZA )
				$where = $this->table->getAdapter()->quoteInto($this->_primary() . ' = ?' , $id);

			if ( $this->_file() && $this->_valid($data) )
			{
				return $this->_salva($this->data,$opt,$where);
			} else 
			{
				//echo 'Os dados digitados não conferem, verifique e tente novamente.';
				return false;
			}
		}
	}
	
	/**
	 * apaga o registro com o $id passado
	 *
	 * @param integer $id
	 * @param array $files
	 * @return int|bool affected_rows
	 */
	public function del ($id=NULL,array $files=NULL)
	{
		if ( NULL !== $id )
			$this->id = $id;
		
		if ( NULL !== $files && sizeof($files) )
		{
			$this->current = $this->select('*',$this->id);
			
			while ( list($k,$v) = each($files) ) 
			{
				if ( !empty($this->current->{$v}) )
					$this->beReplaced[$v] = $this->current->{$v};
			}
			
			$this->_replaceFile();
		}
		
//		echo $this->table->_cascadeDelete('modelo',array('id_modelo' => $this->id));
		return $this->table->delete($this->table->getAdapter()->quoteInto($this->_primary() . ' = ?' ,
									$this->id));
	}
	
	/**
	 * carrega as opções para upload
	 *
	 * @param string $column
	 * @param array $options
	 * @return Model_Data This Model_Data object.
	 */
	public function load_options ($column,$options=NULL)
	{
		if ( NULL === $options )
		{
			if ( $this->options[$column] )
				return $this->options[$column];
			else
			{
				if ( $this->options['default'] )
					return $this->options['default'];
				else 
					throw new Exception('Faltam as opções dos arquivos.');
			}
		} else 
		{
			$this->options[$column] = $options;
			return $this;
		}
	}
	
	/**
	 * define as colunas existentes
	 *
	 * @param array $columns
	 */
	public function _required (array $columns)
	{
		$this->required = $columns;
	}
	
	/**
	 * define as colunas que não podem ser nulas
	 *
	 * @param array $columns
	 */
	public function _notNull (array $columns)
	{
		$this->notNull = $columns;
	}

	/**
	 * retorna os valores em SELF::data
	 *
	 * @return object $data
	 */
	public function _data ()
	{
		return (object) $this->data;
	}
	
	/**
	 * carrega os arquivos postados no formulário
	 *
	 * @return bool
	 */
	public function _file ($files=NULL)
	{
		if ( sizeof($_FILES) || sizeof($files) )
		{
			$op = (array) $this->options;
			$dt = (array) $this->data;
			
			if ( !sizeof($files) )
			{
				if ( sizeof(array_diff(array_keys($op),array_keys($dt))) )
					$files = $_FILES;
				else 
					return true;
			}

			while ( list($k,$v) = each($files) )
			{
				if ( $files[$k]['size'] > 60 && in_array($k,$this->required) )
				{
					$options = $this->load_options($k);					
					$file = new App_File_Upload ($files[$k],$options['path'],$this->load_options($k));

					if ( !$file->_isError() )
					{
						$this->data[$k] = $file->_where();
						$this->beReplaced[$k] = $this->current->{$k};
						
						$this->_where = $file->_where();
					} else 
					{
						$this->view->e = $file->_messages();
						return false;
					}
					unset($file);
				} elseif ( in_array($k,$this->notNull) && !array_key_exists($k,$this->data) ) 
					return false;
			}

			return true;
		} elseif ( sizeof($this->options) && in_array(array_keys($this->options),$this->notNull) )
			return false;
		else
			return true;
	}
	
	/**
	 * salva/atualiza os dados passados
	 *
	 * @param array $data
	 * @param int $opt
	 * @param string $where
	 * @return SELF::_salva()
	 */
	public function _salva ($data,$opt,$where=NULL)
	{
		//Zend_Loader::loadClass('Zend_Db_Expr');
		//$expr = new Zend_Db_Expr('Now()');
		$expr = date('Y-m-d H:i:s');
		
		if ( $opt == self::ATUALIZA )
		{
			if ( NULL === $where )
			{
				throw new Exception('Falta WHERE');
			} else
			{
				//if ( in_array('alterado',$this->_columns()) )
				if (  $this->_columns('modificado') )
					$this->data['modificado'] = $expr;
				
				$r = $this->table->update($this->data,$where);
				
				if ( $r )
					$this->_replaceFile();

				return $r;
			}
		} elseif ( $opt == self::NOVO )
		{
			//if ( in_array('criado',(array)$this->_columns()) )
			if ( $this->_columns('criado') )
				$this->data['criado'] = $expr;
				
			return $this->table->insert($this->data);
		} else
		{
			throw new Exception('Falta a Opção');
		}
	}
	
	/**
	 * duplica o registro e suas dependencias
	 *
	 * @param Zend_Db_Table_Row $row
	 * @return bool
	 */
	public function duplica (Zend_Db_Table_Row $row)
	{
		$a = $row->toArray();
		
		if ( sizeof($a) )
		{
			unset($a[$this->_primary()]);
			$id = $this->table->insert($a);
		} else 
			return false;
		
		if (! $id )
			return false;
			
		$dependent = $this->_table()->getDependentTables();
		
		while ( list($k,$v) = each($dependent) )
		{
			$td = new $v();
			$t  = $row->findDependentRowset($td);
			
			if ( sizeof($t) )
			{
				$data = $t->toArray();
				
				foreach ($data as $r) 
				{
					array_shift($r);
					$r[$this->_primary()] = $id;
					
					try {
						$e = $td->insert($r);
					} catch (Exception $e)
					{
						return false;
					}
				}
			}
		}
		
		if ( $e > 0 )
			return true;
		else
			return false;
	}
	
	/**
	 * copia o registro com novos parametros
	 *
	 * @param Zend_Db_Table_Row $row
	 * @param array $nid
	 * @param array $rule
	 * @return bool
	 */
	public function copy (Zend_Db_Table_Row $row, array $nid, array $rule)
	{
		$a = $row->toArray();
		
		if ( sizeof($a) )
		{
			unset($a[$this->_primary()]);
			
			while ( list($k,$v) = each($rule) )
				unset($a[$v]);
				
			$a = array_merge($a,$nid);
			
			$id = $this->table->insert($a);
		} else 
			return false;
		
		if (! $id )
			return false;
		else 
			return true;
	}
	
	/**
	 * retorna o objeto da tabela
	 *
	 * @return Zend_Db_Table
	 */
	public function _table()
	{
		return $this->table;
	}
	
	/**
	 * retorna a chave primária
	 *
	 * @param string $p
	 * @return string
	 */
	protected function _primary ($p=NULL)
	{
		if ( NULL === $p )
		{
			$p = $this->table->info('primary');
			return (string) $p[1];
		} else
			$this->primary = $p;
	}
	
	/**
	 * Busca as colunas na $table
	 *
	 * @param string $c
	 * @return bool
	 */
	protected function _columns ($c=NULL)
	{
		if ( NULL === $c )
		{
			$p = $this->table->info('cols');
			return $p;
		} else
		{
			$p = $this->table->info('cols');
			return (bool) in_array($c,$p);
		}
	}

	/**
	 * substitui os arquivos atualizados
	 *
	 */
	protected function _replaceFile ()
	{
		if ( sizeof( $this->beReplaced ) )
		{
			while ( list($k,$v) = each ($this->beReplaced) ) 
				@unlink('/' . $v);
		}
	}
	
	/**
	 * valida os dados passados
	 *
	 * @param array $data
	 * @return bool
	 */
	protected function _valid (array $data=NULL)
	{
		if ( !sizeof($this->required) )
		{
			$this->erro = 'sem required';
			return false;
		}
				
		if ( NULL === $data && !is_array($this->data) )
		{
			$this->erro = 'sem dados';
			return false;
		} else
		{
			if ( !is_array($data) )
			{
				$this->erro = 'sem dados 2';
				return false;
			}
				
		    Zend_Loader::loadClass('Zend_Filter_PregReplace');
		    $filter = new Zend_Filter_PregReplace(array('match' => $this->matchPattern,
		    											'replace' => $this->matchReplace));

        	while ( list($key,$val) = each($data) )
        	{   
    			if ( in_array($key,$this->required) === TRUE )
				{
					if ( !empty($val) )
						$this->data[$filter->filter($key)] = trim($val);
					elseif ( in_array($key,$this->notNull) === TRUE
						    && !array_key_exists($key,$this->options) )
					{
						$this->data = $data;
						$this->erro = $key;
						return false;
					} else 
						$this->data[$filter->filter($key)] = trim($val);
				}
		    }

		    if ( sizeof($this->data) )
		    {
				//$this->erro = 'deu certo';		    	
				$this->erro = FALSE;		    	
		    	return true;
		    }
		    
		}
		$this->erro = 'data';
		return false;
	}
	
	public static function outputString($string)
	{
		$string = $string;
		//$string = utf8_encode($string);
		
		return $string;
	}
	
	public function getErro ()
	{
		return $this->erro;
	}
}