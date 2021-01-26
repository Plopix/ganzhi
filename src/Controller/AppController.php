<?php

declare(strict_types=1);

namespace App\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\Routing\Annotation\Route;

final class AppController
{
    /**
     * @Route("/sources", name="sources")
     * @Template()
     */
    public function sources(): array
    {
        return [];
    }

    /**
     * @Route("/", name="home")
     * @Template()
     */
    public function index(): array
    {
        return [];
    }


}
