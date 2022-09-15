<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Comment extends Pivot
{
    use HasFactory;

    public $incrementing = true;
    
    protected $fillable = [
        'user_id',
        'article_id',
        'content',
        'parent_id'
    ];

    public function childs()
    {
        return $this->hasMany(Comment::class, 'parent_id', 'id');
    }   

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id', 'id');
    }

    public function allChilds()
    {
        return $this->childs()->with('allChilds');
    }

    public function user() {
       return $this->belongsTo(User::class, 'user_id', 'id');
    }
    
    public function allChildComments() {
        $childComments = [];
        $comments = [$this];
        while(count($comments) > 0) {
            $nextComments= [];
            foreach ($comments as $comment) {
                $tempt =  $comment->allChilds->all();
                if($tempt) {
                    $childComments[$comment->id] = $tempt;
                }
                $nextComments = array_merge($nextComments, $comment->allChilds->all());
            }
            $comments = $nextComments;
        }
    
        return $childComments;
    }

    public function test() {
        return 'it actually work';
    }

}
