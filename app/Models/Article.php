<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'title',
        'content',
        'user_id',
        'category_id',
        'thumbnail',
        'view_count'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function likes()
    {
        return $this->belongsToMany(User::class, 'likes', 'article_id', 'user_id')->withPivot('value');
    }
    public function bookmark()
    {
        return $this->belongsToMany(User::class, 'bookmarks', 'article_id', 'user_id');
    }
    public function comments()
    {
        return $this->belongsToMany(User::class, 'comment', 'article_id', 'user_id')->using(Comment::class)->withPivot('id', 'content', 'parent_id', 'reply_id')->withTimestamps();
    }
    public function view()
    {
        return $this->belongsToMany(User::class, 'view', 'article_id', 'user_id');
    }
}
