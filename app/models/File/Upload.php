<?php
/**
 * App_File_Upload
 *
 * @category   File Upload
 * @copyright  Copyright (c) leandro.php@terra.com.br
 * @version    2.0
 */

require_once 'Filter_Acentos.php';

class App_File_Upload 
{

    /**
	* root's path
	* @var string
	*/
    protected $root = NULL;
    
    /**
     * path to save
     * @var string 
     */
    protected $path = NULL;
    
    /**
     * $FILE's constant
     * @var array
     */
    protected $file = NULL;
    
    /**
     * image size (if is)
     * @var string|integer
     */
    //protected $size = NULL;
    
    //new
    protected $sizeW = NULL;
    protected $sizeH = NULL;

    /**
     * 
     * @var bool
     */
    protected $WaterMark = false;
    
    /**
     * upload type = image|file|auto
     * @var string
     */
    protected $type = 'auto';
    
    /**
     * array of allowed extensions
     * @var array
     */
    protected $extensions = array('jpg','gif','png','bmp','tif','dwg','zip','plt','pdf','txt','csv');
    
    /**
     * file extension
     * @var mixed
     */
    protected $ext = NULL;
    
    /**
     * file extension
     * @var mixed
     */
    protected $quality = 100;
    
    /**
     * read or not the txt file 
     * @var bool
     */
    protected $readTXT = false;
    
    /**
     * delete file after process
     * @var bool
     */
    protected $delete = false;
    
    /**
     * where the image was saved
     * @var mixed
     */
    protected $where = NULL;
    
    /**
     * If the destination file already exists, it will be overwritten.
     * @var bool
     */
    protected $overwrite = false;
    
    /**
     * file contents
     * @var string
     */
    protected $fileContents = NULL;
    
    /**
     * Error code
     * @var mixed
     */
    protected $code = NULL;
    
    /**
     * Error Messages
     * @var mixed
     */
    protected $message = NULL;
    
    /**
     * Success
     */
    const SUCCESS = 1;
    
    /**
     * General Failure
     */
    const FAILURE = 0;
    
    /**
     * File error
     */
    const FILE_ERROR = -10;
    
    /**
     * Extension error
     */
    const EXT_ERROR = -20;
    
    /**
     * File exists
     */
    const FILE_EXIST = -30;
    
    /**
     * Directory permission deny or path not exists
     */
    const PATH_DENY = -40;
    
    /**
     * Image size error
     */
    const IMAGE_SIZE = -50;

    /**
     * error reading the file
     */
    const FILE_READING = -60;
    
    
    /**
     * Class Constructor
     * 
     *
     * @param array $_FILES $file
     * @param string $path path where the will be save
     * @param array $options array of extra options
     * @return void
     */
    public function __construct($file,$path,array $options=array())
    {
        if ( NULL === $path )
            return self::PATH_DENY;
        else
            $this->path = $path;

        if ( !is_array($file) )
            return self::FILE_ERROR;
        else
            $this->file = $file;           
            
       if ( sizeof($options) )
       {
           while ( list($key,$val) = each($options) ) 
               $this->{$key} = $val;
       }

       if ( NULL === $this->root )
       {
           $this->root = $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR;
       }
       
       if ( !$this->_valid() )
           return self::EXT_ERROR;
       
       /*
        * 
        */
       $filter = new Filter_Acentos();
       //$filter->espacoBranco(true);
       
	   $fileNameTemp 		= basename($this->file['name'],('.'.$this->ext));
       $fileNameTemp 		= $filter->filter($fileNameTemp);
       
       $this->file['name'] 	= $fileNameTemp .'.'. $this->ext;
       /*
        * 
        */
           
       if ( $this->type == 'auto' )
       {
           if ( preg_match("/^image\/(pjpeg|jpeg|png|gif|bmp)$/i", $this->file["type"]) )
           {
              $this->type = 'image';
           } else 
           {
              $this->type = 'file';
           }
       }

       if ( $this->type == 'image' )
       {
          if ( extension_loaded('gd') )
          { 
	         if ( preg_match("/^image\/(pjpeg|jpeg|png|gif|bmp)$/i", $this->file["type"]) ) 
	             return $this->_image();
	         else 
	         {
	             $this->code    = self::EXT_ERROR;
	             $this->message = 'Image format not supported.';
	         }
          } else 
          {
              $this->code    = self::FAILURE;
              $this->message = 'GD extension is not loaded';
          }
       }
       
       if ( $this->type == 'file' )
       {
           return $this->_file();
       }
       
       return self::FAILURE; 
    }
    
    /**
     * image type upload
     * @return file path
     */
	private function _image()
	{
	    if ( $this->_file() )
	        $filename = $this->root . $this->where;
	    else
            return false;

		if ( $this->ext == 'jpg' || $this->ext == 'jpeg' ) 
		{
			$img_orig = imagecreatefromjpeg($filename);
							
		} elseif ( $this->ext == 'gif' ) 
		{
			$img_orig = imagecreatefromgif($filename);
							
		} elseif ( $this->ext == 'png' ) 
		{
			$img_orig = imagecreatefrompng($filename);
			$img_orig = imagecolortransparent($img_orig);
			
			//$img_orig = imagecreatefrompng($filename);
			//imagealphablending($img_orig, false);
			//imagesavealpha($img_orig, true);
			//imagecolortransparent($img_orig, true);
			
			//$white = imageColorAllocate ($img_orig, 255, 255, 255);
			//$img_orig = imagecolortransparent($img_orig,$white);
							
		} elseif ( $this->ext == 'bmp' ) 
		{
			$img_orig = imagecreatefromgd($filename);
		}

		// image sizes
		$h_orig = imagesy($img_orig); //height
		$w_orig = imagesx($img_orig); //width
						
		if ( ($this->sizeW !== NULL && $this->sizeH !== NULL) && ($w_orig > $this->sizeW || $h_orig > $this->sizeH) ) 
		{
			$p = min($this->sizeH/$h_orig, $this->sizeW/$w_orig);
			
		} else 
		{
			$p = 1;	
		}

		/*
		 * 
		 */
		$w_final = $w_orig * $p; // final width
		$h_final = $h_orig * $p; // final height
		
		$image = imagecreatetruecolor($w_final, $h_final);

		@mkdir($this->root, 0777, true);
		@chmod($filename, 0777);
										
		imagecopyresampled($image, $img_orig, 0, 0, 0, 0, $w_final+1, $h_final+1, $w_orig, $h_orig);

		try 
		{
		    imagejpeg($image, $filename, $this->quality);
		    
		        /*
		         * MEIO QUE É UMA GAMBETA
		         */
		        if ( $this->min == true )
		        {
		        	imagedestroy($image);
		        	$filenameMin = $this->root . 'min_'.$this->where;
		        	
			        $img_min = imagecreatefromjpeg($filename);
			        
			        // image sizes
					$h_orig = imagesy($img_min); //height
					$w_orig = imagesx($img_min); //width
					
					if ( ($this->sizeWmin !== NULL && $this->sizeHmin !== NULL) && ($w_orig > $this->sizeWmin || $h_orig > $this->sizeHmin) ) 
						$p = min($this->sizeHmin/$h_orig, $this->sizeWmin/$w_orig);
					else 
						$p = 1;	

					/*
					 * 
					 */
					$w_final = $w_orig * $p; // final width
					$h_final = $h_orig * $p; // final height
					
					$image = imagecreatetruecolor($w_final, $h_final);
			
					//@mkdir($this->root, 0777, true);
					@chmod($filenameMin, 0777);
													
					imagecopyresampled($image, $img_min, 0, 0, 0, 0, $w_final, $h_final, $w_orig, $h_orig);
					
					imagejpeg($image, $filenameMin, $this->quality);
					imagedestroy($img_min);
		    	}
		    	
		        if ( $this->med == true )
		        {
		        	imagedestroy($image);
		        	$filenameMed = $this->root . 'med_'.$this->where;
		        	
			        $img_med = imagecreatefromjpeg($filename);
			        
			        // image sizes
					$h_orig = imagesy($img_med); //height
					$w_orig = imagesx($img_med); //width
					
					if ( ($this->sizeWmed !== NULL && $this->sizeHmed !== NULL) && ($w_orig > $this->sizeWmed || $h_orig > $this->sizeHmed) ) 
						$p = min($this->sizeHmed/$h_orig, $this->sizeWmed/$w_orig);
					else 
						$p = 1;	
			
					/*
					 * 
					 */
					$w_final = $w_orig * $p; // final width
					$h_final = $h_orig * $p; // final height
					
					$image = imagecreatetruecolor($w_final, $h_final);
			
					//@mkdir($this->root, 0777, true);
					@chmod($filenameMed, 0777);
													
					imagecopyresampled($image, $img_med, 0, 0, 0, 0, $w_final, $h_final, $w_orig, $h_orig);
					
					imagejpeg($image, $filenameMed, $this->quality);
					imagedestroy($img_med);
		        }
		        /*
		         * 
		         */
	        
		    
		} catch (Exception $e)
		{
		    $this->code    = self::IMAGE_SIZE;
		    $this->message = 'Error on resample image'; 
		}

		imagedestroy($img_orig);
		
		$this->code    = self::SUCCESS;
		$this->message = 'Image saved';
		return true;
	}
	
	/**
	 * file type upload
	 * @return file path
	 */
	private function _file()
	{	
		$file     = $this->file['name'];
		$name     = basename($this->file['name'],'.'.$this->ext);
		$n        = 1;
		$filename = $name .'.'. $this->ext;
		
		if ( !is_dir($this->root . $this->path . DIRECTORY_SEPARATOR) )
			@mkdir ($this->root . $this->path .DIRECTORY_SEPARATOR, 0755, true);//@mkdir ($this->root . $this->path ."/", 0755);
		
		@chmod($this->root . $this->path .DIRECTORY_SEPARATOR,0777);
	
		if ( file_exists($this->root."$this->path".DIRECTORY_SEPARATOR."$filename") && $this->overwrite == false ) 
		{
			$filename = $name . '_'. $n . '.' . $this->ext;
			
			while ( file_exists($this->root . $this->path . DIRECTORY_SEPARATOR . $filename) ) 
			{
				 $n++;
				 $filename = $name . '_' . $n . '.' . $this->ext;
			}
		}
        try 
        {
		    move_uploaded_file($this->file['tmp_name'],$this->root . $this->path . DIRECTORY_SEPARATOR . $filename);
        } catch (Exception $e)
        {
            $this->code    = self::PATH_DENY;
            $this->message = 'A error occurred when trying to move the uploaded file';
            return false;
        }
		
        @chmod($this->root . $this->path .DIRECTORY_SEPARATOR,0755);
		@chmod($this->root . $this->path . DIRECTORY_SEPARATOR . $filename, 0755);
		
		/*
		 * $this->where   = $this->path . '\\' . $filename;
		 */
		if ( ($this->path == '') || ($this->path == NULL) )
			$this->where = $filename;
		else 
			$this->where = $this->path . DIRECTORY_SEPARATOR . $filename;
		
		$this->code    = self::SUCCESS;
		$this->message = 'File saved';

    	if ( $this->readTXT )
		   return $this->_read();
		else 
		   return $this->where;
	}
	
	/**
	 * type file validation
	 * @return bool
	 */
	public function _valid ()
	{
	   if (! @preg_match("/\.(". implode('|',$this->extensions) ."){1}$/i", $this->file['name'], $ext) )
       {
           $this->code    = self::EXT_ERROR;
           $this->message = 'Extension not allowed';
           return false;
       } else
       {
           $this->ext = trim(strtolower($ext[1]),'.');
           return true;
       }
	}
	
	/**
	 * read file and return contents
	 * @return mixed
	 */
	public function _read ()
	{
	    $filename = $this->root . $this->where;
	    
	    if ( is_readable($filename) && NULL === $this->fileContents )
	    {
	        $this->fileContents = file_get_contents($filename);
	        
	        if ( $this->delete && !$this->_delete() )
	        {
	            $this->code    = self::FILE_READING;
	            $this->message = 'An error ocurred wnen trying to delete the file';
	        }
	        
	        return $this->fileContents;
	        
	    } elseif ( NULL === $this->fileContents ) 
	    {
	        $this->code    = self::FILE_READING;
	        $this->message = 'Error reading the uploaded file';
	        
	        return false;
	    } else 
	    {
	        return $this->fileContents;
	    }
	}
	
	/**
	 * delete the uploaded file
	 * @var bool
	 */
	public function _delete ()
	{
	    return (bool) @unlink($this->root . $this->where);
	}
	
	/**
	 * return where the file was saved
	 *
	 * @return string
	 */
	public function _where ()
	{
		return $this->where;
	}
	
	/**
	 * return the code message error
	 * @return mixed
	 */
	public function _getCode ()
	{
	    return $this->code;
	}
	
	/**
	 * return the error message
	 * @return string 
	 */
	public function _messages ()
	{
	    return $this->message;
	}
	
	/**
	 * check if there is a error
	 * @var bool
	 */
	public function _isError ()
	{
	    return (bool) ($this->_getCode() < 1 || NULL === $this->_getCode());
	}
	
	/**
	 * destruct method
	 */
	public function __destruct()
	{
	    if ( true === $this->delete )
	        $this->_delete();
	}
}

?>